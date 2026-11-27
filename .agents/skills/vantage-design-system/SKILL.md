---
name: vantage-design-system
description: Design and build high-density technical consoles, admin dashboards, and network telemetry interfaces in the "Vantage Graphite" design language (luci-theme-vantage). Covers tokens, dark-first slate palette, tabular monospace data, topology path diagrams, 36px/44px control geometry, safe DOM practices, and slide-out inspector drawers.
when_to_use: "Use when designing and building high-density technical consoles, admin dashboards, and network telemetry interfaces."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
skills: frontend-design, design-spec, clean-code
---

# Vantage Design System & Console Architecture Guide

The **Vantage Design System** (inspired by [`anothaDev/luci-theme-vantage`](https://github.com/anothaDev/luci-theme-vantage)) is a high-density, precision technical console design language. It is optimized for operational scannability, telemetry monitoring, tabular data alignment, and fast keyboard-first navigation (`Ctrl+K`).

---

## 1. Visual Identity & Aesthetic Principles

- **Graphite Neutral Canvas**: Cool, high-contrast slate surfaces with crisp `1px` structural hairlines (`--v-line` / `--v-line-2`) instead of heavy drop shadows, blurs, or marketing glassmorphism.
- **Information Density Over Chrome**: Controls share a unified compact `36px` height (`--ctl-h`), body copy sits at `13px` (`--fs-base`), and micro-labels/kickers sit at `10.5px` (`--fs-micro`).
- **Dual-Font Pair**:
  - **Prose / UI Labels (`--font`)**: Native OS sans-serif (`system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif`).
  - **Technical Identifiers (`--mono`)**: Tabular monospace (`ui-monospace, JetBrains Mono, SFMono-Regular, Cascadia Mono, monospace`) with `font-variant-numeric: tabular-nums` for IPs, MACs, interfaces, ports, speeds, counters, and timestamps.
- **Strict Semantic Status Colors**:
  - Blue (`--v-accent`): Interactive selection, active links, focus rings.
  - Green (`--v-ok`): Healthy, connected, link up.
  - Amber (`--v-warn`): Elevated load, warning, unsaved changes, regulatory limits.
  - Red (`--v-err`): Critical error, packet loss, link down, destructive action.
  - Cyan / Soft Blue (`--v-info`): Informational chips, secondary telemetry.
  - Each semantic color has a matching soft tint (`--v-*-soft`) for low-opacity pills and badges.
- **Zero External Assets**: No CDN stylesheets, no external icon fonts, no web fonts. Self-contained inline/build-generated SVGs only.

---

## 2. Design Tokens (`--v-*`)

Expose on `:root` (Light Mode) and `html[data-darkmode="true"]` (Dark Mode):

```css
:root {
  /* Color Palette - Light Mode */
  --v-bg: #f3f4f6;
  --v-surface: #ffffff;
  --v-surface-2: #f6f7f9;
  --v-surface-3: #eceef1;
  --v-line: #e2e5e9;
  --v-line-2: #cbd0d6;
  --v-text: #15181c;
  --v-text-2: #4b525b;
  --v-text-3: #5f666f;
  --v-accent: #3563e9;
  --v-accent-ink: #ffffff;
  --v-accent-soft: rgba(53, 99, 233, 0.12);
  --v-ok: #0c7f63;
  --v-ok-soft: rgba(12, 127, 99, 0.11);
  --v-warn: #9a5b00;
  --v-warn-soft: rgba(214, 138, 0, 0.15);
  --v-err: #c42b2b;
  --v-err-soft: rgba(196, 43, 43, 0.10);
  --v-info: #1f63c6;
  --v-info-soft: rgba(31, 99, 198, 0.10);

  /* Typography */
  --font: system-ui, -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, sans-serif;
  --mono: ui-monospace, "JetBrains Mono", "SFMono-Regular", "Cascadia Mono", Menlo, Consolas, monospace;
  --fs-micro: 10.5px;
  --fs-sm: 12px;
  --fs-base: 13px;
  --fs-md: 14px;
  --fs-lg: 16px;
  --fs-xl: 20px;
  --fs-2xl: 24px;

  /* Geometry & Spacing */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-6: 24px;
  --sp-8: 32px;
  --r-sm: 4px;
  --r: 6px;
  --r-lg: 8px;
  --ctl-h: 36px;
  --top-h: 52px;
  --rail-w: 56px;
  --rail-w-pinned: 224px;
  --label-w: 180px;
  --field-max: 360px;
  --content-max: 1320px;
}

html[data-darkmode="true"] {
  /* Color Palette - Dark Mode (Graphite First) */
  --v-bg: #0d0f12;
  --v-surface: #15181d;
  --v-surface-2: #1c2026;
  --v-surface-3: #242931;
  --v-line: #2a303a;
  --v-line-2: #38404d;
  --v-text: #edeef0;
  --v-text-2: #9da4b0;
  --v-text-3: #7a828e;
  --v-accent: #4c77f7;
  --v-accent-ink: #ffffff;
  --v-accent-soft: rgba(76, 119, 247, 0.18);
  --v-ok: #16a37f;
  --v-ok-soft: rgba(22, 163, 127, 0.18);
  --v-warn: #d9822b;
  --v-warn-soft: rgba(217, 130, 43, 0.18);
  --v-err: #e55353;
  --v-err-soft: rgba(229, 83, 83, 0.18);
  --v-info: #3b82f6;
  --v-info-soft: rgba(59, 130, 246, 0.18);
}
```

---

## 3. Shell & Navigation Patterns

1. **Collapsible Left Icon Rail (`56px` → `224px`)**:
   - Fixed `56px` vertical rail with category icons.
   - Hovering/clicking opens a flyout submenu. Can be pinned open (`224px`) with label text persisted in `localStorage`.
   - On mobile (`<= 720px`), collapses into a centered bottom bar or mobile bottom sheet.
2. **Top Bar (`52px`)**:
   - **Left**: Hierarchical breadcrumb (`Category > Page > Tab`) with an interactive page switcher dropdown.
   - **Center/Right**: Fuzzy Command Palette trigger (`Ctrl+K` or `/`).
   - **Right Cluster**: Unsaved changes pill, Host identity chip (`hostname · model`), and Theme Toggle (`Auto / Light / Dark` loaded in `<head>` to prevent FOUC).
3. **Segmented Tabs (`.vt-pagetabs`)**:
   - Replaces multi-tier tabs with unified `36px` segmented track buttons (`--v-surface-3` track with active button on `--v-surface`).

---

## 4. Key Component Patterns (`.vt-*`)

- **Hero Network Path Topology (`.vt-hero`, `.vt-netpath`)**:
  - Visual horizontal flow: WAN Uplink ↔ Gateway Router ↔ LAN / Wi-Fi Bridges ↔ Clients.
  - Rendered with SVG connection lines (`.vt-edge`) and status nodes (`.vt-node`).
- **Telemetry Cards & Resource Gauges (`.vt-card`, `.vt-metric`, `.vt-progress`)**:
  - `1px solid var(--v-line)` border, `var(--v-surface)` background, `8px` border-radius.
  - Monospace readouts with slim threshold-colored progress meters (`--v-ok` → `--v-warn` → `--v-err`).
- **High-Density Tables (`.vt-table`)**:
  - `10.5px` uppercase tracking column headers (`--fs-micro`).
  - Monospace numeric and address columns.
  - Hover highlight on rows (`var(--v-surface-3)`).
  - Responsive cards on small screens (`<= 720px`) using `td[data-title]`.
- **Slide-Out Inspector Drawer (`.vt-drawer`)**:
  - Opens from the right on row click with detailed telemetry and inline entity/alias editing without full-page navigation.

---

## 5. Engineering Constraints & Anti-Slop Discipline

1. **Zero `innerHTML` / Programmatic DOM Construction**:
   - Always build DOM nodes safely using hyperscript helpers (`E('tag', attrs, children)`) or sanitized framework templates.
2. **Tabular Monospace Everywhere for Technical Data**:
   - Never use standard proportional fonts for IPs, MAC addresses, port numbers, throughput rates, or timestamps.
3. **Touch vs. Pointer Target Sizes**:
   - Mouse targets: `36px` height.
   - Touch devices: `44px` minimum tap targets with `16px` form input text (prevents iOS auto-zoom).
4. **Offline Replay & Mock Data**:
   - Never use real customer IPs or MACs in mock fixtures. Use RFC documentation ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`, `2001:db8::/32`, MAC `00:00:5E:00:53:xx`).

