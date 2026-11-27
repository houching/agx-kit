---
name: spec-gate
version: 1.0.0
priority: P0
trigger: model_decision
description: Apply before running /create, /orchestrate, or implementing new features and multi-file changes — requires an approved specs/<slug>/spec.md while exempting single-file fixes.
---

# Spec Gate Rules (TIER 1) - AG Kit

> Loaded when executing `/create`, `/orchestrate`, net-new features, or multi-file behavioral changes. Protocol and templates live in `.agents/skills/spec-driven-dev/SKILL.md`.

## 🛑 GATE: Approved `spec.md` before building features (MANDATORY)

Before starting `/create`, `/orchestrate`, or implementing any **new feature** or **multi-file behavioral change**, an approved functional spec must exist at `specs/<slug>/spec.md`.

1. **Check** `specs/` (and `specs/living/` for existing domain rules) to find a matching `specs/<slug>/spec.md`.
2. **If missing or `Status: Draft`:** STOP — run `/spec` (following `spec-driven-dev`) to capture functional requirements, `GIVEN/WHEN/THEN` acceptance criteria, edge cases, and non-goals, and get user confirmation (`Status: Approved`) before writing implementation code.
3. **If `Status: Approved`:** Read `specs/<slug>/spec.md`, ensure `{task-slug}.md` covers every `AC-n` criterion, and run `/spec-verify` before reporting completion (then `/spec-archive` when ready to merge into `specs/living/`).

## Exemptions (Do NOT Block)

- Single-file bug fixes, typos, formatting, or trivial config tweaks with clear, narrow scope.
- Read-only research, codebase surveys, and Q&A.
- Standalone `/plan` authoring (if `specs/<slug>/spec.md` exists, link its `AC-n` IDs; if requirements are ambiguous, recommend `/spec` first).

| Need | Read |
| ---- | ---- |
| Spec format, lifecycle, and traceability | `.agents/skills/spec-driven-dev/SKILL.md` |
| Create or clarify a spec | `.agents/workflows/spec.md` |
| Verify code against spec | `.agents/workflows/spec-verify.md` |
| Sync deltas and archive spec | `.agents/workflows/spec-archive.md` |
