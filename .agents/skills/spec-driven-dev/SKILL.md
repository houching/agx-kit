---
name: spec-driven-dev
description: Spec-Driven Development (SDD) protocol for functional specifications, GIVEN/WHEN/THEN acceptance criteria, delta tracking, cross-artifact traceability, and spec archiving.
when_to_use: "When creating or clarifying functional specs before planning (/spec), checking spec-to-plan-to-code alignment (/spec-verify), or syncing and archiving completed specs (/spec-archive)."
allowed-tools: Read, Write, Edit, Glob, Grep
version: 1.0.0
---

# Spec-Driven Development (SDD)

> Separate **what & why** (`specs/<slug>/spec.md`) from **how** (`{task-slug}.md` + code), verify traceability against real execution, and preserve living system truth.

---

## 1. Hybrid Artifact Model

| Artifact | Path | Purpose | Lifecycle |
|---|---|---|---|
| **Active Feature Spec** | `specs/<slug>/spec.md` | Functional requirements, `GIVEN/WHEN/THEN` criteria, edge cases, non-goals, traceability | `Draft` → `Approved` → `Implemented` → `Archived` |
| **Implementation Plan** | `{task-slug}.md` (project root) | Technical architecture, file layout, agent assignments, task breakdown (`/plan`) | Linked from `spec.md` |
| **UI Design Spec** | `DESIGN.md` (project root) | Visual tokens & design rationale (required for UI work per `design-rules.md`) | Linked when UI applies |
| **Living Domain Spec** | `specs/living/<domain>.md` | Canonical current-state specification for a domain/module | Updated on `/spec-archive` |
| **Archived Spec** | `specs/archive/<YYYY-MM-DD>-<slug>/spec.md` | Historical record of completed feature specs | Created by `/spec-archive` |
| **Project Principles** | `.agents/memory/MEMORY.md` | Durable conventions and architectural decisions (acts as project constitution) | Checked at spec & verify |

> **Slug naming:** lowercase kebab-case, 2–4 words, max 30 chars (e.g., `specs/auth-oauth/spec.md`), matching `{task-slug}.md` when practical.

---

## 2. Spec Lifecycle States

```text
Draft ──(/spec clarify + user approval)──▶ Approved ──(/plan → /create or /orchestrate)──▶ Implemented ──(/spec-verify pass → /spec-archive)──▶ Archived
```

- **`Draft`**: Initial spec created; open `[NEEDS CLARIFICATION]` markers or unconfirmed trade-offs exist. Blocks `/create` and `/orchestrate` under `spec-gate.md`.
- **`Approved`**: Ambiguities resolved and user confirmed scope/criteria. Ready for `/plan` (if not yet planned) and implementation.
- **`Implemented`**: Code and tests satisfy every `AC-n` and `/spec-verify` has passed with execution evidence.
- **`Archived`**: Delta requirements merged into `specs/living/<domain>.md` and `specs/<slug>/` moved into `specs/archive/<YYYY-MM-DD>-<slug>/`.

---

## 3. `specs/<slug>/spec.md` Contract

Keep specs **concise and technology-agnostic** (describe observable behavior, inputs/outputs, and constraints — leave implementation details to `{task-slug}.md`):

```markdown
# Spec: [Feature Title]

- **Slug:** `<slug>`
- **Status:** Draft | Approved | Implemented | Archived
- **Domain:** `<domain>` (target file in `specs/living/<domain>.md`)
- **Plan:** `<task-slug>.md` (or `Pending /plan`)
- **Updated:** YYYY-MM-DD

## Problem & Goal
[Who is this for, what problem it solves, and the measurable outcome.]

## Requirements & Acceptance Criteria
<!-- For brownfield changes to existing behavior, tag each item [ADDED], [MODIFIED], or [REMOVED] -->

### [ADDED] REQ-1: [Short Capability Name]
- **AC-1:** **GIVEN** [precondition/context] **WHEN** [action/trigger] **THEN** [observable outcome].
- **AC-2:** **GIVEN** [precondition/context] **WHEN** [error/boundary action] **THEN** [expected handling].

## Edge Cases & Error States
- [Boundary inputs, empty states, permissions/authz, failure recovery]

## Non-Goals (Out of Scope)
- [Explicit exclusions to prevent scope creep]

## Clarifications
- [Q&A decisions resolved during Socratic discovery or clarify audit; mark unresolved items `[NEEDS CLARIFICATION: ...]`]

## Traceability
| AC ID | Plan Task | Implementation / Test | Verification |
|---|---|---|---|
| AC-1 | Task 1 | `path/to/file` / `test_name` | Pending |
```

---

## 4. Phase Protocols

### Phase A: Author & Clarify (`/spec`)
1. **Load Context**: Read `.agents/memory/MEMORY.md` (plus `project-conventions.md`, `tech-decisions.md`) and any matching `specs/living/<domain>.md`.
2. **Socratic Discovery**: Apply `brainstorming` — ask only blocking questions not already answered in memory or living specs (Purpose, Users, Scope, Edge Cases, Constraints).
3. **Draft or Refine**: Write `specs/<slug>/spec.md` with stable `AC-n` IDs and `[ADDED]` / `[MODIFIED]` / `[REMOVED]` tags when altering existing behavior.
4. **Ambiguity Audit**: Scan the spec before requesting approval:
   - Replace vague adjectives ("fast", "intuitive", "secure") with measurable or testable criteria.
   - Check missing failure, permission/authz, empty-state, and migration cases.
   - Check for conflicts with `.agents/memory/` principles.
   - List unresolved decisions explicitly as `[NEEDS CLARIFICATION: ...]`.
5. **Approval Checkpoint**: Do not set `Status: Approved` until every `[NEEDS CLARIFICATION]` item is resolved and the user confirms the spec. Stop before writing code.

### Phase B: Cross-Check & Verify (`/spec-verify`)
Combine artifact consistency analysis with runtime verification:
1. **Artifact & Constitution Audit**:
   - Check every `AC-n` in `specs/<slug>/spec.md` maps to a concrete task in `{task-slug}.md` (if a plan exists) and a real implementation path.
   - Flag `UNPLANNED` (`AC-n` missing from plan/code), `SCOPE_CREEP` (major changes absent from `spec.md`), and `PRINCIPLE_CONFLICT` (violates `.agents/memory/` rules).
2. **Execution Verification** (use `verify-changes` + `lint-and-validate`):
   - Execute tests, typechecks, linters, and targeted behavioral checks covering each `AC-n` and edge case.
   - Never mark `PASS` by reading code alone — attach actual command output or test case names.
3. **Status Update**: Update the `## Traceability` table in `specs/<slug>/spec.md`. Set `Status: Implemented` only when zero `FAIL`, `UNPLANNED`, or `PRINCIPLE_CONFLICT` items remain.

### Phase C: Sync & Archive (`/spec-archive`)
1. **Pre-Flight Gate**: Confirm `specs/<slug>/spec.md` is `Implemented` (or `/spec-verify` passed). If unverified, ask the user whether to run `/spec-verify` first or explicitly override.
2. **Merge Deltas to Living Spec**:
   - Open or create `specs/living/<domain>.md`.
   - Apply `[ADDED]` requirements, update `[MODIFIED]` requirements in place, and move or remove `[REMOVED]` requirements (noting the archived slug/date for auditability).
   - Keep unrelated existing sections in `specs/living/<domain>.md` intact.
3. **Archive Change**:
   - Update `Status: Archived` and `Updated: YYYY-MM-DD` in `specs/<slug>/spec.md`.
   - Move `specs/<slug>/` to `specs/archive/<YYYY-MM-DD>-<slug>/`.
4. **Memory Distillation**: If the change introduced lasting architectural or project conventions, propose saving them via `/remember`.
