# PLAN — Close remaining Core retirement items

## User steering after the partial closeout

The latest user decision corrects Preview terminology first; see
`flowdoc-preview-definition-correction-2026-09-05.md`. Keep the PDF.js/Node
proposal paused. The user's question about confirming in chat was not approval
to drop Node 20. The PDF security finding remains unresolved and separate from
interactive Preview. No new dispatch or support-policy change is authorized by
the definition correction. Earlier return/acceptance events below remain intact.

## Authority Boundary
Owner Project Control; Work flowdoc-product-development-resumption > flowdoc-frontend-expert-roadmap; Phase phase-core-closeout-followup; Checklist checklist-core-closeout-followup; Evidence evidence-core-closeout-followup-2026-09-05. Canonical planning/registry, not map promotion. User explicitly requested finishing reported residuals; no R3 authorization.

## ผลล่าสุดภาษาไทย

ลบโฟลเดอร์ว่างค้างเดิมทั้ง3จุดแล้ว และรวมแพ็กเกจที่แก้ audit4รายการเข้า Editor main0cb3970. ตรวจทั้ง worktree/main ผ่าน113ชุด412tests พร้อม typecheck/build. เปลี่ยนเฉพาะ package-lock.json ไม่มีฟีเจอร์หรือข้อกำหนด Node เปลี่ยน

ยังไม่ปิดทั้งรอบ: PDFเหลือ1high เพราะรุ่นแก้ต้องใช้Node22.13ขึ้นไป รอคำตอบว่าจะเลิกรองรับNode20ได้หรือไม่ เครื่องนี้ใช้Node24อยู่แล้ว อีกจุดคือโหลดล่าสุดเปิดกล่องยืนยันในหน้าต่างCodexที่เครื่องมือ browserไม่เห็น; ทักษะComputer Useห้ามควบคุมChatGPT UI จึงรอตูมกดตกลงบนข้อความทดสอบแล้วตรวจผลต่อ. ทั้งสองรายการยังไม่ถือว่าผ่าน ไม่มีการอนุมัติโดยปริยาย

## Restored state
PC main9c8e0fc, Core mainf4f4425, Editor main8e29b711, Backend maina639dad. Prior dispatch all rooms terminal and accepted, queue empty; automatic returns1–5 preserved in core-v1-closeout-plan-2026-09-05.md and linked return documents. Previous product and PC full worktree/main gates passed. Former worktree locators are removed; no resumption from conversation-only registry. Three empty roots39e1/Core,a64f/Core,1470/Editor remain process-locked; they have no Git registration or unique files. Prior latest-reload browser step hit a confirmation/tool timeout after successful create/edit/save/reopen and stale preservation. Prior audit5high needs actual analysis, not blanket fix.

## Current dispatch registry
dispatchSetId dispatch-core-closeout-followup-2026-09-05; parallelLimit1; roomRunId room-editor-dependency-audit-01; lane-editor-dependency-audit; task locator pending, state prepared. Work Type product-implementation; owner repo-editor, role product-implementation-agent. Return handoff-editor-dependency-audit-2026-09-05-01. PLAN01a0707e-00e9-74e1-be1b-a272a1b89d2a/local. Active Return Command send_message_to_thread to PLAN with terminal packet before/with final; no user bridge. ACK/read completion before writes, liveness20minutes after locator with meaningful progress renewal, unavailable/silent task UNKNOWN/BLOCKER not accepted. handoffInbox/completionQueue empty; arrivalSequence starts1, duplicate byhandoffId idempotent; returnOrderPolicy BLOCKER/FAIL/CCR first thenarrival, one acceptance at a time. Same real WORK gets in-scope revisions; PLAN never patches product source afterdispatch.

## Editor WORK capsule
Room WORK, Work Type product-implementation, lane-editor-dependency-audit, owner repo-editor, product-implementation-agent with evidence/boundary review. Phase/checklist/evidence above; checklist item dependency-audit.
Read canonical PC AGENTS/delivery/orchestration/routing/authority/terminology contracts and Editor AGENTS. Latest staged continuation is this PC worktree; prior durable return editor-core-retirement-return-2026-09-05.md provides ordinary sibling-junction setup lessons. Skills flowdoc-project-control, systematic-debugging, verification-before-completion, using-git-worktrees; use TDD for actual source repair, not artificial tests of lockfile versions.
Accepted fresh PLAN npm audit:5high; nanoid<3.3.18, postcss<=8.5.22, react-router7.18.1 (and propagated react-router-dom), pdfjs-dist5.6.205 affected before6.2.108. Full JSON C:/Users/nekot/AppData/Local/Temp/editor-closeout-audit.json. Treat counts as point-in-time. Verify advisories via authoritative sources and npm registry; determine actual runtime/dev exposure without claiming exploitation.

Allowed dedicated Editor worktree from main only: reproduce audit, trace dependency paths and PDF.js adapter usage, update smallest supported compatible patched packages/lockfile. PDF.js may require a major dependency upgrade; this is within fixing the reported audit if existing supported runtime and product/API semantics remain unchanged and current PDF integration passes. If change requires Node engine/support-policy change, new product behavior or cross-owner edits, return CCR before broadening. No blind npm audit fix --force, audit suppression, removed functionality, blanket dependency upgrades or arbitrary overrides. Prefer compatible transitive lock updates; any override must be narrowly justified by upstream compatibility proof.
Existing chunk-size warning is diagnostic only: report cause/size, no unrelated bundling refactor or warning-threshold suppression. Worktree npm ls lexical junction diagnostic may be explained with exact canonical realpaths; no fabricated manifest/snapshot workaround. Restore only ordinary temporary sibling Core/Backend junctions to canonical repositories after verifying absent paths/targets; remove own auxiliary links non-recursively when finished. Do not mutate canonical Editor setup before PLAN integration/main instructions. No Core/Backend installs or source edits.

Required evidence: before/after audit JSON summary including prod/dev, exact versions/dependency paths/advisory links, fresh ordinary npm ci reproducibility and full Editor npm run check in worktree, focused current PDF adapter/worker tests and build asset checks if PDF library changes, preserved Creator tests. Use existing tests plus meaningful new regression only when source behavior requires it; do not add broad browser frameworks. Commit verified changes, return exact refs/files/behavior/checks/risks/PR summary, keep worktree for integration. PLAN merges then sends any required same-owner normal canonical dependency install and main verification to this WORK; main source repairs return here. No self-merge, PC writes or map promotion.

Unknowns: actual dependency impact until traced; original Core deletion cause outside scope; browser tooling confirmation issue distinct from product bug. Stop on unowned changes, unsupported engine/API break, unknown dirty state or unsafe setup. Terminal PASS/FAIL/BLOCKER/RISK/UNKNOWN with active return to PLAN; evidence candidate only.

## PLAN-owned parallel work
Inspect/revalidate exact three empty ordinary directory roots and remove non-recursively only when still empty, resolved exactly, unregistered in Git and no user data. If locked identify responsible process read-only; never force-kill unrelated processes or change OS protection. Recheck latest-reload browser using existing local test document and servers; act only on agent-created test edits. Product bug evidence goes to owning WORK with bounded revision/CCR as appropriate. Final records preserve any real blocker rather than claiming absence. Commit/gate PC worktree, integrate/gate main, cleanup completed lanes. No map/node promotion.


## Continuation events

Three previously empty locked roots revalidated ordinary, exact resolved paths, empty and unregistered; non-recursive Directory.Delete(path,false) succeeded for all39e1/Core,a64f/Core,1470/Editor. No process termination, recursive delete, source changes or user data loss. Cleanup candidate PASS.

New Editor task01a071eb-36b3-73b0-83e3-c1cc42e143e8/local, clean worktree13e1/flowdoc-vnext-editor at8e29b711. Active ACK/read completion received. Automatic handoff01 arrived, arrival1, BLOCKER/CCR: PDF6.2.108 drops Node20 support; actual exploitability not established. Read-only diagnosis accepted; implementation not accepted. Revision01 to SAME task authorizes minimal compatible router/postcss/nanoid updates while preserving PDF5.6.205/Node20 policy until user answers explicit floor22.13 question. Final commit/full gate held for disposition; active ACK received, liveness20minutes renewed. Active return handoff02 required. No manual recovery or duplicate; queue empty.

## Browser diagnosis / user decisions pending

Both old test servers were stopped between turns. Restarted canonical Backend51411 with existing creator-draft-review.sqlite and Editor51412; no source changes. Original test document survived at revision3. Created revision4 title ฉบับล่าสุดสำหรับทดสอบโหลดกลับ in second tab, first tab revision3 attempted stale save preserving ข้อความทดสอบก่อนโหลดล่าสุด. Clicking latest-load triggers host confirmation. Browser getJsDialog returns undefined and CDP mouse/focus times out. Read-only Windows accessibility through Computer Use confirms a Codex-hosted dialog from127.0.0.1:51412 with the exact discard text and OK/Cancel; underlying product action is pending confirmation, not proven broken. No native click performed: skill guidance forbids automating ChatGPT desktop UI. User requested to click OK on agent-created test edits; await reply before claiming reload. Separately user Node floor22.13 approval pending; compatible dependency work continues, PDF/engine policy unchanged until answer.

## Partial implementation acceptance / main integration

User support-policy decision remains pending; no approval inferred. PLAN authorized finishing compatible partial repair in same WORK while keeping PDF blocker. Automatic handoff02 received, arrival2, Context ACK complete, accepted partial commit0cb3970a4f3a083a0b214c5a72fab953319aafdc after exact lock diff review. package-lock only14+/14-; router-dom/router7.18.2, PostCSS8.5.23,nanoid3.3.18 within existing manifest ranges, no override/Node/PDF changes. Fresh ci and focused5files17tests PASS; full worktree113files412tests/typecheck/build PASS; full audit5high->1high and prod3high->1high, PDF only. No duplicate/manual recovery, queue empty.

PLAN clean-main fast-forward integration0cb3970, stopped only own preview session84870 for dependency install. Same WORK received main verification packet: canonical npm ci/full Editor check/audit and clean normal links, no source repair. Return03 required; deadline20minutes renewed. Runtime preview may restart51412 only after absence check with existing Backend51411. Remaining PDF/Node decision and host browser confirmation remain separate user-dependent gates.

## Main acceptance / retrievable continuation

Automatic handoff03 received, arrival3, correct owner/ACK, accepted main setup and compatible patch evidence. Canonical npm ci and full Editor check exit0 (113files412tests,typecheck,build), audit full/prod still1high PDF only, canonical npm ls links PASS and tracked/index clean. No manual recovery/duplicate; completionQueue empty. Preview restored by WORK session87429 on51412 against unchanged Backend44667/51411. Main0cb3970. room-editor-dependency-audit-01 terminal RISK with pending PDF policy revision, not failed or silently lost. Keep clean merged13e1 worktree/codex/editor-dependency-audit while that user-dependent lane remains open; it is an intentional pending locator, not stale cleanup. Phase in-review, composite audit/latest-reload checklists remain unpassed. No inferred approval.

Known remaining decisions: explicit Editor support floor22.13 approval needed to take PDF6.2.108; user may require continued Node20 support instead. Native host confirmation requires user OK on agent-created test text to complete latest-load observation; no automated ChatGPT UI click. Once responses arrive, restore this registry and revise SAME WORK as needed; new terminal handoff IDs continue04+, arrival sequence continues4+. Main source repair stays owner WORK. No R3/map promotion.

## PC gate diagnosis

Initial PC worktree full gate stopped at existing tests/core-doc-migration.test.ts:823: one30s timeout, no assertion mismatch; other182source-doc tests passed. The unchanged focused test passed at the original timeout (28.09s test duration), with38other cases excluded only for diagnosis, not accepted as a full gate. This test builds several disposable Git fixtures/submodule cases. No test source, timeout, assertions or skips changed. Retry the full required gate unchanged; preserve initial failure in Temp/core-closeout-followup-pc-worktree-check.log and focused result in core-closeout-followup-focused-timeout.log. Do not claim full PASS from focused recovery.
