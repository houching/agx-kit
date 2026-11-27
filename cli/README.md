<p align="center">
  <img src="https://raw.githubusercontent.com/houching/agx-kit/main/web/public/images/logo.png" width="128" height="128" alt="AGX Kit" />
</p>

# AGX Kit CLI

CLI for installing and safely updating [AGX Kit](https://github.com/houching/agx-kit), a collection of agents, skills, workflows, rules, memory conventions, and validation tools for Google Antigravity.

## Installation

```bash
bun add -d github:houching/agx-kit
bunx agx-kit init
```

Or install globally:

```bash
bun add -g github:houching/agx-kit
agx-kit init
```

## Commands

| Command | Description |
|---|---|
| `agx-kit init` | Install `.agents`; safely merges when an installation already exists |
| `agx-kit update` | Update managed files while preserving local changes |
| `agx-kit rollback` | Restore the newest or a selected pre-update backup |
| `agx-kit status` | Show installation, manifest, toolkit version, backups, and CLI status |

## Safe update model

AGX Kit records SHA-256 baselines in `.agents/.agx-kit/manifest.json`. During an update it compares the previous upstream version, the current local file, and the new upstream file.

- Clean managed files are updated automatically.
- Files changed only locally are preserved.
- User-created files are preserved.
- Files changed both locally and upstream are reported as conflicts.
- Incoming conflict copies are written under `.agents/.agx-kit/conflicts/`.
- A full pre-update backup is stored under `.agx-kit-backups/` by default.

```bash
agx-kit update --dry-run
agx-kit update --strategy merge
agx-kit update --strategy replace
agx-kit rollback
agx-kit rollback --backup 20260712-090000-000
```

`merge` is the default strategy. `replace` is intentionally explicit and still creates a backup unless `--no-backup` is supplied.

## Common options

```bash
agx-kit init --path ./myapp
agx-kit init --branch dev
agx-kit update --force
agx-kit update --quiet --force
agx-kit update --conflict-report ./agx-kit-update.json
agx-kit rollback --dry-run
```

When `--quiet` is used against an existing installation, `--force` is required because the CLI cannot safely ask for confirmation.

## Included toolkit

- **20 specialist agents**
- **47 skills**
- **13 workflows**
- Shared rules, persistent memory conventions, MCP configuration, and validation scripts

## Exit codes

| Code | Meaning |
|---:|---|
| `0` | Success or no changes required |
| `1` | Download, validation, filesystem, or configuration failure |
| `2` | Update completed, but one or more conflicts require manual review |
| `130` | Interrupted by the user |

## License

MIT
