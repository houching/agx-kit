---
name: spec
description: Create or clarify a functional specification in specs/<slug>/spec.md using Socratic discovery before planning.
version: 1.0.0
requires_agents: product-manager, project-planner
requires_skills: spec-driven-dev, brainstorming
artifact_outputs: functional-spec, clarification-log
---

# /spec — Functional Specification & Clarification

$ARGUMENTS

---

## 🔴 CRITICAL RULES

1. **NO CODE WRITING** — Produces or refines `specs/<slug>/spec.md` only.
2. **What & Why before How** — Keep specs technology-agnostic; leave implementation design to `/plan`.
3. **Load `spec-driven-dev` + `brainstorming`** — Follow the `specs/<slug>/spec.md` contract and Socratic Gate.
4. **Explicit Approval** — Never mark `Status: Approved` while `[NEEDS CLARIFICATION]` markers remain or before user confirmation.

---

## Task

Use `product-manager` (requirements/ACs) and `project-planner` (scope/context check) with `spec-driven-dev`:

```text
CONTEXT:
- User Request: $ARGUMENTS
- Mode: SPECIFICATION ONLY (no code, no {task-slug}.md yet)
- Output: specs/<slug>/spec.md

WORKFLOW:
1. CHECK MEMORY & LIVING SPECS:
   - Read .agents/memory/MEMORY.md and relevant topic files.
   - Check specs/ and specs/living/ for existing specs on this domain.
2. CHOOSE MODE:
   - New feature/change (no active spec): run Socratic discovery (Purpose, Users, Scope, Edge Cases, Non-Goals) -> draft specs/<slug>/spec.md with Status: Draft, GIVEN/WHEN/THEN criteria (AC-1..N), and [ADDED]/[MODIFIED]/[REMOVED] delta tags for brownfield edits.
   - Existing spec or clarify pass: audit specs/<slug>/spec.md for vague adjectives, missing error/auth/empty cases, [NEEDS CLARIFICATION] items, and memory conflicts -> ask targeted clarifying questions and update Clarifications.
3. APPROVAL CHECKPOINT:
   - Present a concise summary of requirements, non-goals, and any remaining open questions.
   - Only set Status: Approved after the user confirms.
```

---

## After Spec Creation / Clarification

```text
[OK] Spec updated: specs/<slug>/spec.md (Status: Draft | Approved)

Next steps:
- If Draft: answer the open clarification questions above to approve the spec
- If Approved: run `/plan` to generate `{task-slug}.md`, then `/create` or `/orchestrate`
```
