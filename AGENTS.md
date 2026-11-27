# AGENTS.md

Workspace instructions for Google Antigravity and compatible agents. See [`.agents/rules/`](.agents/rules/) for the full AGX Kit rule set.

## Subagent Delegation Rules

- Act as the Orchestrator: use `grep_search` or `find_by_name` to locate target files yourself before delegating.
- When delegating to `worker`, always pass:
  1. Exact file paths and relevant line ranges or symbol names.
  2. A single, narrow objective and the expected verification command.
- Do not delegate tiny single-line edits or tasks that depend on your next step.
