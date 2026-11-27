<p align="center">
  <img src="./web/public/images/logo.svg" width="128" height="128" alt="AGX Kit" />
</p>

<h1 align="center">AGX KIT</h1>

<p align="center">
  Antigravity-first agent engineering kit with rules, skills, specialist agents, workflows, persistent memory, MCP guidance, orchestration, and a native safety hook.
</p>

<p align="center">
  <strong>Primary runtime: Google Antigravity</strong><br/>
  <a href="./README-KM.md">ភាសាខ្មែរ</a> · <a href="https://agx-kit.pages.dev">Documentation</a> · <a href="./MIGRATION.md">Migration guide</a> · <a href="./.github/RELEASE_SETUP.md">Release setup</a> · <a href="./SECURITY.md">Security</a>
</p>

---

## Production profile

AGX Kit installs a complete `.agents/` workspace contract. Antigravity is the supported production runtime for this release. Other tools may read the Markdown components, but runtime behavior outside Antigravity is not part of the production compatibility guarantee.

| Capability | Production implementation |
| --- | --- |
| Rules and skill discovery | `.agents/rules/`, `.agents/skills/`, `.agents/workflows/` |
| Specialist routing | 24 role definitions and intelligent-routing skills |
| Persistent context | `.agents/memory/` and context-compression guidance |
| Orchestration | `/coordinate`, `/orchestrate`, Antigravity `/agents` and `/tasks` |
| MCP | Workspace config plus explicit, backup-aware sync helper |
| Tool safety | Native `PreToolUse` gate for high-confidence destructive commands |
| Packaging | Local Antigravity plugin bundle with a SHA-256 content inventory |
| Validation | Toolkit CI, Antigravity Doctor, regression tests, Dependency Review, CLI and web checks |

The native hook is deliberately narrow. It blocks root-filesystem deletion, drive formatting, and raw-disk overwrite patterns while allowing normal project cleanup such as deleting `dist/` or `node_modules/`. It does not replace Antigravity permissions, workspace trust, sandboxing, or human approval.

## Requirements

- Bun 1.2 or newer for repository-level Antigravity tooling, hooks, and tests.
- Python 3.10 or newer for AGX Kit validators and utility scripts.
- A trusted Google Antigravity workspace.
- Git for safe update, review, and rollback workflows.

The published CLI supports both Bun and Node.js 18 or newer; repository tooling and Antigravity integration checks run on Bun.

## Quick start

### Install into a project

```bash
bun add -d github:houching/agx-kit
bunx agx-kit init
```

Or install the CLI globally:

```bash
bun add -g github:houching/agx-kit
agx-kit init
```

Do not add `.agents/` to the project `.gitignore` when Antigravity needs to index rules, skills, or workflows. To keep it local without disabling discovery, add `.agents/` to `.git/info/exclude` instead.

### Verify the workspace

```bash
bun run check:agents
bun run check:antigravity
bun run test:antigravity
```

`check:antigravity` is read-only. The default MCP example contains `YOUR_API_KEY`, so the normal doctor reports a warning until the example is configured. Use strict mode only after all placeholders have been resolved:

```bash
bun .agents/hooks/antigravity-doctor.mjs --strict
```

### Open in Antigravity

After opening the repository as a trusted workspace:

1. Confirm slash commands such as `/plan`, `/coordinate`, and `/orchestrate` are discovered.
2. Confirm relevant skills are selected from `.agents/skills/`.
3. Run a normal command such as `bun test` and confirm it is allowed.
4. Verify the safety hook with a mocked payload rather than executing a destructive command:

```bash
printf '%s' '{"tool_args":{"CommandLine":"rm -rf /"}}' \
  | bun .agents/hooks/validate-tool-call.mjs
```

The command must exit non-zero and print `BLOCKED by AGX Kit`.

## Safe updates and rollback

AGX Kit updates are merge-aware. User-owned files and locally modified managed files are preserved by default.

```bash
agx-kit update --dry-run          # Preview the exact plan
agx-kit update                    # Merge safely and create a backup
agx-kit update --strategy replace # Explicit full replacement, still backed up
agx-kit rollback                  # Restore the newest pre-update backup
```

Update metadata is stored in `.agents/.agx-kit/`. Backups are stored in `.agx-kit-backups/` outside the managed toolkit tree. Read [MIGRATION.md](MIGRATION.md) before upgrading an existing installation to the Antigravity-native release.

## Antigravity-native integration

### Runtime contract

`.agents/antigravity.json` declares the six supported integration phases and the documented Antigravity CLI capabilities used by AGX Kit. It avoids inventing a minimum semantic version when upstream documentation does not define one.

### Native safety hook

Antigravity loads `.agents/hooks.json`, which registers:

```json
{
  "enabled": true,
  "PreToolUse": [
    {
      "matcher": "run_command",
      "command": "bun .agents/hooks/validate-tool-call.mjs",
      "timeout": 10
    }
  ]
}
```

To temporarily disable the AGX Kit hook while diagnosing a compatibility issue, set `"enabled": false`, reopen the workspace, and report the payload shape privately if it may contain sensitive data. Do not delete Antigravity's own permission controls.

### MCP configuration

Review the workspace MCP plan without writing to the home directory:

```bash
bun .agents/hooks/sync-mcp.mjs --check
bun .agents/hooks/sync-mcp.mjs --print
```

After replacing placeholders, explicitly apply to one supported target:

```bash
bun .agents/hooks/sync-mcp.mjs --apply --target suite
bun .agents/hooks/sync-mcp.mjs --apply --target cli
```

Existing servers with the same name are preserved unless `--force` is supplied. A timestamped backup is created before an existing target file is changed. Never commit real MCP credentials.

### Build and inspect the plugin

```bash
bun run build:antigravity-plugin
```

Review `dist/antigravity-plugin/` before local installation. The bundle contains packaged skills, agents, rules, converted workflow commands, the native hook, an MCP example, and `PLUGIN_CONTENTS.json` with SHA-256 entries.

```bash
agy plugin install ./dist/antigravity-plugin
agy plugin list
```

Plugin installation is optional; the repository-native `.agents/` workspace remains the source of truth for project development.

## Included components

| Component | Count | Purpose |
| --- | ---: | --- |
| Agents | 24 | Domain specialist and orchestration role definitions |
| Skills | 56 | Progressive domain knowledge and executable validation helpers |
| Workflows | 16 | Repeatable slash-command procedures |
| Rules | 7 | Workspace-wide routing, spec-gate, safety, design, and coding constraints |
| Memory topics | 4 required topics plus index | Durable project conventions, decisions, preferences, and feedback |

Every agent, skill, workflow, and rule has a SemVer contract. `.agents/manifest.json`, `.agents/manifest.lock.json`, and `.agents/DEPENDENCY_GRAPH.md` make the managed toolkit reproducible and detect drift.

```bash
bun run generate:agents
bun run check:agents
```

## Common workflows

| Command | Purpose |
| --- | --- |
| `/brainstorm` | Explore options and architecture before implementation |
| `/coordinate` | Run separable research or review tasks in parallel, then synthesize |
| `/create` | Create a feature or application with structured gates |
| `/debug` | Perform evidence-based root-cause analysis |
| `/deploy` | Execute production pre-flight checks and deployment workflow |
| `/enhance` | Safely modify an existing codebase |
| `/orchestrate` | Plan, obtain approval, delegate to specialists, and verify |
| `/plan` | Create a detailed implementation plan and checklist |
| `/preview` | Manage local preview servers |
| `/remember` | Save durable project information to memory |
| `/spec` | Create or clarify a functional specification (`specs/<slug>/spec.md`) |
| `/spec-archive` | Sync completed deltas to `specs/living/` and archive the spec |
| `/spec-verify` | Verify spec ↔ plan ↔ code ↔ memory alignment with execution proof |
| `/status` | Summarize active work and blockers |
| `/test` | Design and execute tests |
| `/verify` | Prove changes by running checks instead of relying on inspection |

## Release and production gates

A release candidate is not production-approved until all automated checks and the hands-on Antigravity smoke test in [RELEASE_SETUP.md](.github/RELEASE_SETUP.md) are complete.

Required GitHub checks:

- Toolkit validation
- CLI tests and package validation
- Web lint, typecheck, build, and audit
- Antigravity native contract
- Dependency Review

AGX Kit never requires automatic merge, automatic deployment, or automatic MCP synchronization. Production changes should remain reviewable and reversible.

## Documentation

- [Antigravity implementation details](.agents/hooks/README.md)
- [Migration guide](MIGRATION.md)
- [Security policy and runtime threat model](SECURITY.md)
- [Agent flow architecture](AGENT_FLOW.md)
- [Toolkit architecture](.agents/ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)
- [Release setup](.github/RELEASE_SETUP.md)

## References and attribution

AGX Kit is an original open-source implementation of Markdown-based agent engineering patterns. No proprietary source files are included. Runtime integration decisions are based on public Antigravity documentation and codelabs linked in [.agents/hooks/README.md](.agents/hooks/README.md).

## Support the project

If AGX Kit helps your development workflows, consider supporting the project:

<p align="center">
  <a href="https://www.patreon.com/houching"><strong>Support on Patreon</strong></a>
</p>

## License

Released under the [MIT License](LICENSE) © [houching](https://github.com/houching). See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party attributions and trademark notices.
