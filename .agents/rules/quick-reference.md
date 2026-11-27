---
name: quick-reference
version: 1.1.0
priority: P2
trigger: model_decision
description: Apply when you need a fast lookup of which agents, skills, or validation scripts exist — for routing decisions or recalling the master/key components of the kit.
---

# Quick Reference - AGX Kit

> A fast index of the most-used agents, skills, and scripts.

## Agents & Skills

- **Masters**: `orchestrator`, `project-planner`, `darkcode` (Low-Level/Offensive Sec), `security-auditor` (Cyber/Audit), `backend-specialist` (API/DB), `frontend-specialist` (UI/UX), `mobile-developer`, `debugger`, `game-developer`, `worker` (`model: flash` scoped execution)
- **Key Skills**: `clean-code`, `darkcode`, `brainstorming`, `spec-driven-dev`, `app-builder`, `frontend-design`, `logo-design`, `vantage-design-system`, `gpui`, `mobile-design`, `plan-writing`, `behavioral-modes`, `scrapling`, `rea`
- **SDD Workflows**: `/spec` (author/clarify `specs/<slug>/spec.md`), `/spec-verify` (traceability + execution proof), `/spec-archive` (sync `specs/living/` + archive) — gated by `spec-gate.md`

## Key Scripts

- **Verify**: `.agents/scripts/verify_all.py`, `.agents/scripts/checklist.py`
- **Scanners**: `security_scan.py`
- **Audits**: `ux_audit.py`, `mobile_audit.py`, `lighthouse_audit.py`, `seo_checker.py`
- **Test**: `playwright_runner.py`, `test_runner.py`

---
