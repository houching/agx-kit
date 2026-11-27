# Migrating and Upgrading AGX Kit

This guide covers safe upgrades, post-upgrade verification, MCP synchronization, hook compatibility, and rollback for AGX Kit (`2026.11.28` baseline and newer).

## Antigravity-native runtime layer

AGX Kit installs a workspace-native runtime contract under `.agents/`:

- `.agents/antigravity.json` — machine-readable runtime contract;
- `.agents/hooks.json` — native Antigravity `PreToolUse` hook registration;
- `.agents/hooks/` — safety policy, doctor, MCP sync, plugin builder, schemas, and `bun:test` regression suite;
- `.github/RELEASE_SETUP.md` — CI, npm Trusted Publishing, and Cloudflare Pages deployment gates.

The only hook enabled by default is a narrow `PreToolUse` safety gate for `run_command`. It blocks high-confidence root/disk destructive commands and allows ordinary project cleanup.


## Before upgrading

1. Commit or stash project work.
2. Confirm the current AGX Kit installation is healthy:

```bash
bun run check:agents
```

3. Preview the update:

```bash
agx-kit update --dry-run
```

4. Review any locally modified `.agents` files shown by the plan.

## Upgrade

```bash
agx-kit update
```

AGX Kit creates a backup before changing managed files. It does not silently replace locally modified managed files; conflicts receive an incoming copy and a machine-readable report.

## Post-upgrade validation

```bash
bun run check:agents
bun run check:antigravity
bun run test:antigravity
bun run build:antigravity-plugin
```

Expected result:

- toolkit validation passes;
- Antigravity Doctor reports no errors;
- a warning for `YOUR_API_KEY` is expected until the MCP example is configured;
- Antigravity regression tests pass;
- `dist/antigravity-plugin/` is created successfully.

## Antigravity workspace smoke test

Open the project as a trusted Antigravity workspace and verify:

1. `.agents/rules/`, `.agents/skills/`, and `.agents/workflows/` are discovered;
2. `/coordinate` and `/orchestrate` are available;
3. a normal command such as `bun test` is allowed;
4. the safety hook blocks a mocked destructive payload:

```bash
printf '%s' '{"tool_args":{"CommandLine":"rm -rf /"}}' \
  | bun .agents/hooks/validate-tool-call.mjs
```

Do not execute a real destructive command to test the hook.

## MCP migration

The repository's `.agents/mcp_config.json` remains the workspace source. It contains an example placeholder and is not automatically copied into the home directory.

Review first:

```bash
bun .agents/hooks/sync-mcp.mjs --check
bun .agents/hooks/sync-mcp.mjs --print
```

After replacing placeholders, explicitly apply to one target:

```bash
bun .agents/hooks/sync-mcp.mjs --apply --target suite
bun .agents/hooks/sync-mcp.mjs --apply --target cli
```

Rules:

- unresolved placeholders block `--apply`;
- existing server names are preserved unless `--force` is supplied;
- an existing target file is backed up before writing;
- credentials must remain outside version control.

## Safety hook compatibility

The hook fails open when Antigravity sends invalid JSON or an unrecognized command payload. This avoids locking the entire workspace after an upstream payload change. Valid, recognized destructive commands fail closed with a non-zero exit code.

To temporarily disable only the AGX Kit hook:

```json
{
  "enabled": false
}
```

Keep Antigravity's native permission and workspace-trust controls enabled. Report payload compatibility issues privately when logs may contain prompts, paths, command arguments, or secrets.

## Plugin migration

Plugin installation is optional. Build and inspect it first:

```bash
bun run build:antigravity-plugin
agy plugin install ./dist/antigravity-plugin
agy plugin list
```

The repository-native `.agents/` directory remains the project source of truth. Avoid simultaneously editing generated plugin content and source `.agents` files.

## Rollback

To restore the pre-upgrade toolkit backup:

```bash
agx-kit rollback
```

After rollback, reopen Antigravity so it reloads the previous workspace configuration. If a global MCP file was explicitly synchronized, restore its timestamped `.agx-kit-backup-*` file separately.

## Compatibility summary

| Area | Migration impact |
| --- | --- |
| Agent, skill, workflow names | No breaking rename |
| Memory schema | No breaking change |
| CLI init/update/rollback | Existing merge-aware behavior retained |
| Antigravity hook | New and enabled by default |
| MCP home-directory config | Never changed automatically |
| Plugin | Optional new packaging path |
| Other AI runtimes | Markdown may remain usable, but no production runtime guarantee |
