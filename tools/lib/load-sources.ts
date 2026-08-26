import { readFile } from "node:fs/promises";
import { Ajv2020, type ErrorObject, type ValidateFunction } from "ajv/dist/2020.js";
import * as formatsModule from "ajv-formats";
import type { ProjectDiagnostic } from "../../src/model/diagnostics.js";
import type {
  ChecklistRecord,
  DocumentRecord,
  EvidenceRecord,
  NodeRecord,
  PhaseRecord,
  ProjectRecord,
  RepositoryRecord,
  WorkRecord,
} from "../../src/model/types.js";
import {
  type CanonicalRecordDirectory,
  discoverCanonicalSourceFiles,
} from "./discover.js";
import { compareCodeUnits, ProjectValidationError } from "./errors.js";

export interface LoadedRecord<T extends ProjectRecord = ProjectRecord> {
  relativePath: string;
  value: T;
}

export interface LoadedProjectSources {
  rootDir: string;
  records: LoadedRecord[];
  nodes: LoadedRecord<NodeRecord>[];
  work: LoadedRecord<WorkRecord>[];
  phases: LoadedRecord<PhaseRecord>[];
  checklists: LoadedRecord<ChecklistRecord>[];
  documents: LoadedRecord<DocumentRecord>[];
  repositories: LoadedRecord<RepositoryRecord>[];
  evidence: LoadedRecord<EvidenceRecord>[];
}

const expectedKinds: Record<CanonicalRecordDirectory, ProjectRecord["kind"]> = {
  checklists: "checklist",
  documents: "document",
  evidence: "evidence",
  nodes: "node",
  phases: "phase",
  repositories: "repository",
  work: "work",
};

const schemaDefinitionNames: Record<CanonicalRecordDirectory, string> = {
  checklists: "checklist",
  documents: "document",
  evidence: "evidence",
  nodes: "node",
  phases: "phase",
  repositories: "repository",
  work: "work",
};

let validatorsPromise: Promise<Record<CanonicalRecordDirectory, ValidateFunction>> | undefined;

export async function loadProjectSources(rootDir: string): Promise<LoadedProjectSources> {
  const discovery = await discoverCanonicalSourceFiles(rootDir);
  const diagnostics = [...discovery.diagnostics];
  const loadedRecords: Array<LoadedRecord & { directory: CanonicalRecordDirectory }> = [];
  const validators = await getValidators();

  for (const file of discovery.files) {
    const result = await loadFile(file, validators[file.directory]);
    diagnostics.push(...result.diagnostics);
    if (result.record !== undefined) {
      loadedRecords.push({ ...result.record, directory: file.directory });
    }
  }

  if (diagnostics.length > 0) {
    throw new ProjectValidationError(diagnostics);
  }

  const records = loadedRecords.map(({ directory: _directory, ...record }) => record);
  return {
    rootDir,
    records,
    nodes: records.filter(isNodeRecord),
    work: records.filter(isWorkRecord),
    phases: records.filter(isPhaseRecord),
    checklists: records.filter(isChecklistRecord),
    documents: records.filter(isDocumentRecord),
    repositories: records.filter(isRepositoryRecord),
    evidence: records.filter(isEvidenceRecord),
  };
}

async function loadFile(
  file: { absolutePath: string; relativePath: string; directory: CanonicalRecordDirectory },
  validator: ValidateFunction,
): Promise<{ record?: LoadedRecord; diagnostics: ProjectDiagnostic[] }> {
  let source: string;
  try {
    source = await readFile(file.absolutePath, "utf8");
  } catch {
    return {
      diagnostics: [
        {
          code: "SOURCE_READ_ERROR",
          message: "Could not read the source file.",
          file: file.relativePath,
          hint: "Check that the source file is readable before generating the project index.",
        },
      ],
    };
  }

  let value: unknown;
  try {
    value = JSON.parse(source);
  } catch (error: unknown) {
    return {
      diagnostics: [
        {
          code: "JSON_PARSE_ERROR",
          message: jsonErrorMessage(error),
          file: file.relativePath,
          hint: "Fix the JSON syntax before generating the project index.",
        },
      ],
    };
  }

  const recordId = readRecordId(value);
  const expectedKind = expectedKinds[file.directory];
  if (!hasExpectedKind(value, expectedKind)) {
    return {
      diagnostics: [
        withRecordId(
          {
            code: "RECORD_KIND_MISMATCH",
            message: `Records in data/${file.directory} must have kind \"${expectedKind}\".`,
            file: file.relativePath,
            hint: `Move this record to the matching data directory or set kind to \"${expectedKind}\".`,
          },
          recordId,
        ),
      ],
    };
  }

  if (!validator(value)) {
    return {
      diagnostics: schemaDiagnostics(file.relativePath, recordId, validator.errors ?? []),
    };
  }

  return {
    record: { relativePath: file.relativePath, value: value as ProjectRecord },
    diagnostics: [],
  };
}

async function getValidators(): Promise<Record<CanonicalRecordDirectory, ValidateFunction>> {
  validatorsPromise ??= createValidators();
  return validatorsPromise;
}

async function createValidators(): Promise<Record<CanonicalRecordDirectory, ValidateFunction>> {
  const schemaUrl = new URL("../../schemas/project-control.schema.json", import.meta.url);
  const schema = JSON.parse(await readFile(schemaUrl, "utf8")) as {
    $id: string;
  };
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const addFormats = formatsModule.default as unknown as (instance: Ajv2020) => void;
  addFormats(ajv);
  ajv.addSchema(schema);

  return Object.fromEntries(
    CANONICAL_DIRECTORIES.map((directory) => {
      const validator = ajv.getSchema(`${schema.$id}#/$defs/${schemaDefinitionNames[directory]}`);
      if (validator === undefined) {
        throw new Error(`Schema definition for ${directory} is unavailable.`);
      }
      return [directory, validator];
    }),
  ) as Record<CanonicalRecordDirectory, ValidateFunction>;
}

const CANONICAL_DIRECTORIES: CanonicalRecordDirectory[] = [
  "checklists",
  "documents",
  "evidence",
  "nodes",
  "phases",
  "repositories",
  "work",
];

function schemaDiagnostics(
  file: string,
  recordId: string | undefined,
  errors: ErrorObject[],
): ProjectDiagnostic[] {
  return [...errors]
    .sort((left, right) => {
      const pathOrder = compareCodeUnits(left.instancePath, right.instancePath);
      return pathOrder === 0 ? compareCodeUnits(left.keyword, right.keyword) : pathOrder;
    })
    .map((error) =>
      withRecordId(
        {
          code: `SCHEMA_${toDiagnosticCode(error.keyword)}`,
          message: schemaErrorMessage(error),
          file,
          hint: "Update this record to match its canonical schema.",
        },
        recordId,
      ),
    );
}

function hasExpectedKind(value: unknown, expectedKind: ProjectRecord["kind"]): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    value.kind === expectedKind
  );
}

function readRecordId(value: unknown): string | undefined {
  if (typeof value !== "object" || value === null || !("id" in value)) {
    return undefined;
  }
  return typeof value.id === "string" ? value.id : undefined;
}

function withRecordId(
  diagnostic: Omit<ProjectDiagnostic, "recordId">,
  recordId: string | undefined,
): ProjectDiagnostic {
  return recordId === undefined ? diagnostic : { ...diagnostic, recordId };
}

function jsonErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The file is not valid JSON.";
}

function toDiagnosticCode(keyword: string): string {
  if (keyword === "additionalProperties") {
    return "ADDITIONAL_PROPERTY";
  }
  return keyword.replaceAll(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
}

function schemaErrorMessage(error: ErrorObject): string {
  const location = error.instancePath === "" ? "the record" : error.instancePath;
  return `${location} ${error.message ?? "does not satisfy the schema"}.`;
}

function isNodeRecord(record: LoadedRecord): record is LoadedRecord<NodeRecord> {
  return record.value.kind === "node";
}

function isWorkRecord(record: LoadedRecord): record is LoadedRecord<WorkRecord> {
  return record.value.kind === "work";
}

function isPhaseRecord(record: LoadedRecord): record is LoadedRecord<PhaseRecord> {
  return record.value.kind === "phase";
}

function isChecklistRecord(record: LoadedRecord): record is LoadedRecord<ChecklistRecord> {
  return record.value.kind === "checklist";
}

function isDocumentRecord(record: LoadedRecord): record is LoadedRecord<DocumentRecord> {
  return record.value.kind === "document";
}

function isRepositoryRecord(record: LoadedRecord): record is LoadedRecord<RepositoryRecord> {
  return record.value.kind === "repository";
}

function isEvidenceRecord(record: LoadedRecord): record is LoadedRecord<EvidenceRecord> {
  return record.value.kind === "evidence";
}
