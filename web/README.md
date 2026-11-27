<p align="center">
  <img src="https://raw.githubusercontent.com/houching/agx-kit/main/web/public/images/logo.png" width="128" height="128" alt="AGX Kit">
</p>

<h1 align="center">AGX Kit - Documentation Portal</h1>

<p align="center">
    Astro Starlight documentation portal for AGX Kit — AI Agent templates with Skills, Agents, and Workflows styled in the Vantage Design System.
</p>

---

## ⚡ Quick Start (Local Development)

The `web/` directory contains the official documentation site built using Astro and Starlight.

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Run local development server**:
   ```bash
   bun run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:4321](http://localhost:4321) to view the documentation portal locally.

4. **Production Build**:
   ```bash
   bun run build
   ```

---

## 🏗️ Architecture & Stack

* **Framework:** [Astro 7](https://astro.build/)
* **Docs Engine:** [Starlight](https://starlight.astro.build/)
* **Theme:** Vantage Graphite (`#0d0f12`, 1px hairlines, tabular monospace data scannability)
* **Search:** Pagefind (client-side static search index)
* **Type-checking:** TypeScript 7.1 + `@astrojs/ts-content-mapper`
* **Deployment:** Cloudflare Pages (`web/dist`)

---

## 📦 What gets installed by the CLI

When downstream developers run `agx-kit init`, they install a `.agents/` folder at their project root:

| Directory | Count | Description |
| :--- | :--- | :--- |
| **`agent/`** | 24 | Specialist AI agent configurations (Frontend, Backend, Security, PM, QA, etc.) |
| **`skills/`** | 56 | Domain-specific context modules with conditional loading rules |
| **`workflows/`** | 16 | Pre-configured interactive slash commands |
| **`rules/`** | 7 | Core protocol rules |
| **`hooks/`** | - | Antigravity PreToolUse safety gate and doctor tooling |

---

## 🔗 Links

* **[GitHub Repository](https://github.com/houching/agx-kit)**
* **[Online Documentation](https://agx-kit.pages.dev)**

---

## License

Released under the [MIT License](../LICENSE) © [houching](https://github.com/houching).
