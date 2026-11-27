---
name: spec-verify
description: Cross-check spec requirements, plan tasks, memory principles, and running code/tests to verify spec compliance.
version: 1.0.0
requires_agents: test-engineer, orchestrator
requires_skills: spec-driven-dev, verify-changes, lint-and-validate
artifact_outputs: spec-verification-report
---

# /spec-verify — Spec Consistency & Compliance Verification

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **Load `spec-driven-dev` + `verify-changes`** — Verify both artifact alignment and executed behavior.
2. **No verification by inspection** — Every `AC-n` marked `PASS` requires actual command/test output or observed runtime proof.
3. **Check principles** — Cross-check changes against `.agents/memory/MEMORY.md` and referenced topic files.
4. **Never tamper with tests** — Report failures or drift honestly; do not weaken tests or spec criteria to pass.

---

## Task

Use `orchestrator` and `test-engineer` with `spec-driven-dev` + `verify-changes`:

```text
CONTEXT:
- Target Spec: $ARGUMENTS (if omitted, locate the active spec in specs/*/spec.md)

WORKFLOW:
1. LOCATE ARTIFACTS:
   - Read specs/<slug>/spec.md, linked {task-slug}.md (if present), and .agents/memory/MEMORY.md.
2. STAGE 1 — ARTIFACT & PRINCIPLE ANALYSIS:
   - Trace each AC-n to plan tasks and changed files.
   - Flag UNPLANNED (missing coverage), SCOPE_CREEP (unspec'd major changes), or PRINCIPLE_CONFLICT (memory/convention violation).
3. STAGE 2 — EXECUTION PROOF:
   - Run project lint, typecheck, and test suites plus targeted checks for each AC-n and edge case.
4. UPDATE TRACEABILITY:
   - Update the ## Traceability table in specs/<slug>/spec.md with file/test references and PASS/FAIL/UNVERIFIED status.
   - Set Status: Implemented only if all AC-n pass and zero blockers remain.
```

---

## Expected Output

```markdown
## Spec Verification Report: <slug>

### Traceability Summary
| AC ID | Requirement | Artifact / Test | Result | Evidence |
|---|---|---|---|---|
| AC-1 | ... | `file` / `test` | PASS / FAIL | [command output summary] |

### Gaps & Drift
- Unplanned / Uncovered ACs: [none or list]
- Scope Creep / Principle Conflicts: [none or list]

### Next Step
- [If all PASS: run `/spec-archive <slug>` | If FAIL/GAP: fix blockers and re-run `/spec-verify <slug>`]
```
