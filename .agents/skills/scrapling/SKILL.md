---
name: scrapling
description: Undetectable web scraping and crawling framework using Scrapling (by D4Vinci). Use for static, dynamic (JS), and stealth (Cloudflare/Akamai bypass) scraping, adaptive self-healing selectors, spider automation, and data extraction.
when_to_use: "Use when building undetectable web scrapers, dynamic crawlers with self-healing selectors, or scraping Cloudflare-protected pages."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
skills: python-patterns, clean-code
---

# Scrapling - Web Scraping & Crawling Guide

[Scrapling](https://github.com/D4Vinci/Scrapling) is a high-performance, undetectable Python web scraping framework featuring adaptive / self-healing selectors and progressive fetcher architecture.

## Installation & Setup

```bash
# Core (fast HTTP requests and parsing)
pip install scrapling

# With browser fetchers (Playwright + stealth layers)
pip install "scrapling[fetchers]"
scrapling install

# All features (MCP, tools, shell, fetchers)
pip install "scrapling[all]"
scrapling install
```

---

## 1. Choosing the Right Fetcher

| Fetcher | Use Case | Tech Under the Hood |
|---|---|---|
| `Fetcher` | Fast static HTML scraping, public APIs, performance-critical tasks | TLS fingerprint impersonation + HTTP client |
| `DynamicFetcher` | SPAs, client-rendered apps, JavaScript-heavy sites | Playwright headless browser instance |
| `StealthyFetcher` | Cloudflare Turnstile/Interstitials, Akamai, Datadome, strict bot-detection | Playwright with stealth patches & fingerprint randomization |

---

## 2. Core Patterns

### Pattern A: Fast Static Fetching (`Fetcher`)

```python
from scrapling.fetchers import Fetcher

# Fast GET with custom timeout
page = Fetcher.get("https://quotes.toscrape.com/", timeout=15)

# Extraction with CSS or XPath
quotes = page.css(".quote .text::text").getall()
authors = page.xpath("//small[@class='author']/text()").getall()

for author, quote in zip(authors, quotes):
    print(f"{author}: {quote}")
```

### Pattern B: JavaScript-Heavy Sites (`DynamicFetcher`)

```python
from scrapling.fetchers import DynamicFetcher

# Runs headless browser and waits for network idle
page = DynamicFetcher.fetch(
    "https://quotes.toscrape.com/js/",
    headless=True,
    network_idle=True,
    timeout=30
)

for item in page.css(".quote"):
    text = item.css(".text::text").get()
    author = item.css(".author::text").get()
    print(f"{author}: {text}")
```

### Pattern C: Anti-Bot & Cloudflare Bypass (`StealthyFetcher`)

```python
from scrapling.fetchers import StealthyFetcher

# Stealth browser with resource blocking for speed
page = StealthyFetcher.fetch(
    "https://example.com/protected-page",
    headless=True,
    disable_resources=True,  # drops images, fonts, media
    network_idle=True,
    timeout=45
)

title = page.css("title::text").get()
data_rows = page.css(".data-row::text").getall()
```

---

## 3. Adaptive / Self-Healing Selectors

When target website layouts shift or CSS classes change, Scrapling uses structural fingerprints to find elements without AI calls:

```python
from scrapling.fetchers import Fetcher

# 1. Initial run: fingerprint and save target element
page = Fetcher.get("https://example.com/products", selector_config={"adaptive": True})
title_elem = page.css(".product-title", auto_save=True).first()
print("Initial:", title_elem.text)

# 2. Subsequent runs: auto-relocate if markup changes
page = Fetcher.get("https://example.com/products", selector_config={"adaptive": True})
recovered_elem = page.css(".product-title", adaptive=True).first()

if recovered_elem:
    print("Relocated:", recovered_elem.text)
```

---

## 4. Extraction & Selector Cheatsheet

Scrapling extends CSS and XPath with Scrapy-like pseudo-elements:

- `::text` — direct text node
- `::attr(name)` or `@attr` — attribute value
- `.get()` / `.first()` — returns first matched string or element
- `.getall()` — returns all matches as a list
- Nested queries: `for item in page.css(".container"): item.css("h2::text").get()`

---

## 5. Best Practices & Anti-Detection

1. **Start small**: Try `Fetcher` first. Only escalate to `DynamicFetcher` or `StealthyFetcher` when JavaScript or anti-bot defenses require it.
2. **Speed optimization**: In browser fetchers, pass `disable_resources=True` to ignore images and stylesheets.
3. **Session & Concurrency**: For crawling large sets of URLs, reuse sessions and configure proxy rotation.
4. **Resilience**: Use `auto_save=True` on initial scrapers for volatile e-commerce or directory layouts to survive structural redesigns.

