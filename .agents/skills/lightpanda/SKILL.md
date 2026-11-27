---
name: lightpanda
description: Ultra-fast headless browser built from scratch in Zig for AI agents and web automation without graphical rendering. Use for fast DOM data extraction, single-page fetches, token-free replay scripts (PandaScript), and MCP browsing. For visual CSS debugging and screenshot testing, use Chromium/Playwright instead.
when_to_use: "Use when fast headless browser execution, DOM extraction, single-page fetches, or MCP browser tools are needed without graphical rendering."
allowed-tools: Read, Bash
version: 1.0.0
category: Testing & Quality
skills: webapp-testing, clean-code
---

# Lightpanda — High-Performance Headless Browser

[Lightpanda](https://lightpanda.io) is an open-source headless browser built from scratch in Zig designed specifically for machines and AI agents. It executes JavaScript via V8 and constructs a full DOM tree without the heavy graphical rendering, rasterization, and pixel pipeline of Google Chrome.

## Key Performance Advantages
- **9x faster** startup and execution than headless Chromium.
- **16x less memory** footprint by omitting pixel drawing and GPU subsystems.
- **Native MCP & CDP interfaces** for agent tool calling and Playwright/Puppeteer drop-in support.

---

## 1. When to Use Lightpanda vs Chromium

| Task | Recommended Engine | Rationale |
|---|---|---|
| **Headless Data Retrieval & Scraping** | **Lightpanda** | Ultra-low token, fast execution, no pixel overhead |
| **DOM Tree & Tag Extraction** | **Lightpanda** | Clean HTML extraction, deterministic execution |
| **Token-free Replay (PandaScript)** | **Lightpanda** | Repeatable agent workflows without re-prompting |
| **Visual CSS / Box Model Debugging** | **Chromium / Playwright** | Requires actual pixel rasterization and layout geometry |
| **Visual Regression / Screenshots** | **Chromium / Playwright** | Requires a graphical rendering pipeline (Skia/Blink) |

---

## 2. Installation & Environments

Lightpanda runs natively on Linux and macOS, and on Windows via WSL2 or Docker.

### Node.js (v22+)
```bash
npm install @lightpanda/browser
npx @lightpanda/browser install
```

### Python (3.10+)
```bash
pip install lightpanda
```

### Linux / macOS Shell
```bash
curl -fsSL https://pkg.lightpanda.io/install.sh | bash
```

### Docker
```bash
docker run -d --name lightpanda -p 127.0.0.1:9222:9222 lightpanda/browser:latest
```

---

## 3. Core Usage Patterns

### Pattern A: CLI Fetch
Quick one-off page content extraction:
```bash
lightpanda fetch --dump text https://example.com
lightpanda fetch --dump html https://example.com
```

### Pattern B: Node.js Programmatic Usage
```typescript
import { Lightpanda } from '@lightpanda/browser';

const browser = new Lightpanda();
const response = await browser.fetch('http://localhost:4321', {
  dump: 'html',
});

console.log(response);
```

### Pattern C: CDP Server with Playwright / Puppeteer
Start the Lightpanda CDP server on port 9222:
```bash
lightpanda serve --host 127.0.0.1 --port 9222
```

Connect Playwright to Lightpanda over CDP:
```typescript
import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const page = await browser.newPage();
await page.goto('http://localhost:4321');

const content = await page.content();
console.log(content);
await browser.close();
```

---

## 4. Best Practices for Agents
1. **Identify Traffic**: Pass an explicit descriptive User-Agent header via `--user-agent`.
2. **Resource Capping**: Use `--block-urls` or adblock lists to prevent fetching unwanted third-party trackers or heavy fonts during headless scraping.
3. **Deterministic Automation**: Capture finalized interaction steps as PandaScripts (`lightpanda run`) to execute zero-token headless tasks in production pipelines.
