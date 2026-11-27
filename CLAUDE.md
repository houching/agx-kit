# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

AGX Kit is an Antigravity-first AI agent engineering kit. The product is the `.agents/` workspace contract itself (rules, skills, agents, workflows, memory, hooks) — Markdown + JSON consumed by the Google Antigravity runtime, not compiled code. Three deliverables live in one repo:

- `.agents/` — the toolkit: 24 specialist agents (`agent/`), 56 skills (`skills/`), 16 slash-command workflows (`workflows/`), 7 rules (`rules/`), persistent memory templates (`memory/`), plus the Antigravity runtime layer (`antigravity.json` contract, `hooks.json` PreToolUse safety gate, `hooks/*.mjs` tooling, JSON schemas).
- `cli/` — published npm package `@houching/agx-kit` (Node ≥18 and Bun compatible, ESM). Installs the kit into user projects via `giget`. Entry: `cli/bin/index.js`, managed-tree logic in `cli/lib/managed-tree.js`.
- `web/` — docs site (Astro Starlight + Tailwind 4 + TypeScript 7.1 with `@astrojs/ts-content-mapper`), bilingual English + Khmer (`/km/`), deployed to Cloudflare Pages. Content catalog data lives under `web/src/data/`.

Python ≥3.10 (with PyYAML) runs the toolkit validators; Bun ≥1.2 runs package management (`bun.lock`), scripts, tests (`bun:test`), and Antigravity tooling.

## Commands

All from repo root unless noted.

```bash
# Toolkit (.agents/) — run after ANY change to managed components
bun run generate:agents      # regenerate manifest.json, manifest.lock.json, DEPENDENCY_GRAPH.md
bun run check:agents         # manifest --check + graph --check + validate_kit.py (what CI runs)
bun run test:toolkit         # python -m unittest discover -s .agents/scripts/tests -v

# Antigravity runtime layer
bun run check:antigravity    # doctor: validates contract, hooks, schemas
bun run test:antigravity     # bun test ./.agents/hooks/tests/antigravity.test.mjs
bun run build:antigravity-plugin

# CLI
bun run test:cli             # or: bun run --cwd cli test
bun test ./cli/test/managed-tree.test.js   # single test file

# Web (deps installed per-package: bun install --cwd cli / --cwd web)
bun run lint:web             # astro sync && tsc --noEmit --runExternalCode
bun run typecheck:web
bun run build:web            # astro build (static + Pagefind index)
```

Single Python test: `python -m unittest .agents.scripts.tests.test_toolkit -v` won't work due to path; use `python -m unittest discover -s .agents/scripts/tests -k <pattern> -v`.

## The managed component registry (critical)

Any edit to a managed component (files in `.agents/agent|skills|workflows|rules`, hooks, schemas) **must** be followed by `bun run generate:agents`, or `check:agents` and CI fail on hash mismatch. Never hand-edit `manifest.json`, `manifest.lock.json`, or `DEPENDENCY_GRAPH.md` — all generated.

Dual-track versioning:
- Toolkit releases: **CalVer** `YYYY.M.D` in `.agents/VERSION`.
- Individual components: **SemVer** in their Markdown frontmatter. Bump the component's frontmatter version when changing it.

## Component conventions

- Agents, skills, workflows, and rules are Markdown with YAML frontmatter (`name`, `description`, `version`, plus `tools`/`dependencies` where applicable). Frontmatter shape is validated by `validate_kit.py` — match existing files in the same directory.
- Skills use progressive/conditional loading ("Selective Reading"): a short always-loaded core with deeper sections loaded on demand. Keep new skill content in that shape.
- Cross-component dependencies are declared in frontmatter and materialize in the generated dependency graph; a dangling dependency fails `check:agents`.
- The native PreToolUse hook (`hooks.json` + `validate-tool-call.mjs`) is deliberately narrow: blocks root-filesystem deletion, drive formatting, raw-disk writes only. Don't broaden it into a general linter.

## Release

- Version is CalVer and must be synced across **three** `package.json` files (root, `cli/`, `web/`) plus `.agents/VERSION`, with `bun.lock` files present and no `package-lock.json`. `cli/test/release-safety.test.js` guards this.
- npm publish runs via `.github/workflows/publish.yml` (Bun for install/test/pack, Node 24 + `npm publish --access public` for OIDC Trusted Publishing); CI (`ci.yml`) runs toolkit validation, CLI tests + `bun pm pack --dry-run` + prod audit, and web lint/typecheck/build/audit. `antigravity.yml` runs doctor, hook tests, and plugin build.

## Web notes

- Type-checking uses TypeScript 7.1+ with `@astrojs/ts-content-mapper` registered in `web/tsconfig.json` (`astro sync && tsc --noEmit --runExternalCode`) instead of `astro check`.
- Docs catalogs under `web/src/data/` are maintained separately from `.agents/` — update them when components change.
