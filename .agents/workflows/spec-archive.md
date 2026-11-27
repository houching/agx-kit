---
name: spec-archive
description: Merge completed delta requirements into specs/living/ and archive specs/<slug>/ to specs/archive/.
version: 1.0.0
requires_agents: project-planner, documentation-writer
requires_skills: spec-driven-dev, memory-system
artifact_outputs: living-spec-update, archived-spec
---

# /spec-archive — Living Spec Sync & Change Archival

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **Verify before archiving** — Require `Status: Implemented` (or passing `/spec-verify` evidence) unless the user explicitly overrides.
2. **Preserve living truth** — Merge `[ADDED]`, `[MODIFIED]`, and `[REMOVED]` requirements cleanly into `specs/living/<domain>.md` without erasing unrelated domain specs.
3. **Keep audit trail** — Move `specs/<slug>/` into `specs/archive/<YYYY-MM-DD>-<slug>/` with `Status: Archived`.

---

## Task

Use `project-planner` and `documentation-writer` with `spec-driven-dev` + `memory-system`:

```text
CONTEXT:
- Target Spec: $ARGUMENTS (active specs/<slug>/spec.md)

WORKFLOW:
1. PRE-FLIGHT CHECK:
   - Read specs/<slug>/spec.md and confirm Status is Implemented (or all Traceability rows are PASS).
   - If unverified, STOP and ask the user whether to run `/spec-verify <slug>` first or confirm archival anyway.
2. SYNC TO LIVING SPEC:
   - Read or create specs/living/<domain>.md.
   - Merge [ADDED] items, update [MODIFIED] items in place, and remove/mark [REMOVED] items with source slug and date.
3. ARCHIVE FEATURE SPEC:
   - Update specs/<slug>/spec.md header to `Status: Archived` and `Updated: YYYY-MM-DD`.
   - Move `specs/<slug>/` to `specs/archive/<YYYY-MM-DD>-<slug>/`.
4. MEMORY CHECK:
   - If lasting architectural or project conventions were decided, suggest `/remember [decision]`.
```

---

## After Archiving

```text
[OK] Archived spec: specs/archive/<YYYY-MM-DD>-<slug>/spec.md
[OK] Updated living spec: specs/living/<domain>.md

Next steps:
- Review the living spec diff
- Optionally run `/remember` if any durable project decision should persist across sessions
```
