# Changelog

All notable changes to AGX Kit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/).
This project uses calendar versioning in `YYYY.M.D` format.

## [Unreleased]

No unreleased changes.

## [2026.11.28] - 2026-11-28

### Added
- **AGX Kit Antigravity-Native Baseline:** Complete `.agents/` workspace contract with **24 Specialist Agents**, **56 Skills**, **16 Workflows**, **7 Rules**, persistent memory index, MCP sync helper, native `PreToolUse` safety hook, Antigravity Doctor, and deterministic plugin bundle builder.
- **Bun Runtime & Tooling:** Standardized repository package management, scripts, hooks, CI workflows, Dependabot, and `bun:test` suites on Bun (`bun.lock` across root, `cli/`, and `web/`).
- **Astro Starlight Documentation Site (`web/`):** Vantage Graphite design system, Pagefind search indexing, bilingual English + Khmer (`/km/`) localization with Kantumruy Pro typography, TypeScript 7.1 + `@astrojs/ts-content-mapper` type-checking, and Cloudflare Pages deployment.
- **Safe CLI Lifecycle (`cli/`):** `@houching/agx-kit` with merge-aware `init`, `update`, `rollback`, and `status` commands, Node.js 18+ and Bun runtime compatibility, and npm OIDC Trusted Publishing.
