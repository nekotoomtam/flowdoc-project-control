import type { TruthState, WorkState } from "../../../src/model/types.js";

export type StatusBadgeProps =
  | { kind: "truth"; value: TruthState }
  | { kind: "work"; value: WorkState };

const labels: Record<TruthState | WorkState, string> = {
  current: "Current",
  planned: "Planned",
  risk: "Risk",
  unknown: "Unknown",
  queued: "Queued",
  "in-progress": "In progress",
  blocked: "Blocked",
  "in-review": "In review",
};

export function StatusBadge({ kind, value }: StatusBadgeProps) {
  const label = labels[value];

  return (
    <span className={`status-badge status-badge--${kind} status-badge--${value}`}>
      {label}
    </span>
  );
}
