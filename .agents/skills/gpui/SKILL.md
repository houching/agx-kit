---
name: gpui
description: Design and build ultra-fast, GPU-accelerated native desktop applications and developer interfaces in Rust using GPUI (Zed's hybrid immediate/retained-mode UI framework) and gpui-component. Covers Entity/Context ownership, Views, RenderOnce components, Taffy flexbox/grid styling, actions/keybindings, async tasks, list virtualization, custom Element/canvas GPU painting, and deterministic testing.
when_to_use: "Use when designing or building native desktop applications, code editors, developer tools, high-frequency dashboards, or GPU-accelerated UIs in Rust using GPUI, gpui-component, or Zed UI patterns."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.0.0
skills: rust-pro, frontend-design, design-spec, clean-code
---

# GPUI — GPU-Accelerated Rust UI Design & Architecture

> Build 120+ FPS native desktop interfaces in Rust with hybrid immediate/retained-mode ergonomics, zero-DOM GPU rendering, and strict compile-time ownership safety.

---

## 1. Overview & Architectural Philosophy

**GPUI** (General Purpose UI) is the GPU-accelerated UI framework created by **Zed Industries** to power the [Zed code editor](https://zed.dev). Unlike webview wrappers (Electron, Tauri) or traditional widget trees burdened by `Rc<RefCell<T>>` reference cycles, GPUI combines **retained application state** with **immediate-mode declarative view construction** and a **custom GPU scene graph**.

### Core Design Pillars
1. **Centralized Arena Ownership (`App` & `Entity<T>`)**: All stateful models and views live in a single top-level `App` context on the main thread. References are lightweight, strongly-typed handles (`Entity<T>` and `WeakEntity<T>`), eliminating reference-counting cycles and borrow-checker friction across deeply nested UI trees.
2. **Three-Register UI Programming**:
   - **State Management (`Entity<T>`)**: Persistent domain models and reactive state coordination (`cx.notify()`, `cx.observe()`, `cx.subscribe()`).
   - **Declarative Views (`Render` & `RenderOnce`)**: Tailwind-style method chains (`div().flex().gap_2().bg(...)`) that rebuild a lightweight element description on every frame where state changes.
   - **Low-Level Imperative Elements (`Element` & `canvas`)**: Direct 3-phase layout/prepaint/paint control for custom syntax buffers, node graphs, charts, and GPU shaders.
3. **Hardware-Accelerated Rendering Pipeline**:
   - **Layout**: Powered by **Taffy** (pure-Rust Flexbox & CSS Grid layout engine).
   - **Scene Graph**: Compiles elements into primitive GPU draw calls (`PaintQuad`, shadows, monochrome/polychrome sprites, vector paths via Lyon, subpixel text glyphs).
   - **Backends**: Direct **Metal** (macOS), **DirectX 12 / Win32** (Windows), **Vulkan / Blade** and **wgpu** (Linux / cross-platform), targeting sub-millisecond input latency at 120–144 FPS.

---

## 2. History, Evolution & Changelog Milestones

Understanding GPUI's rapid evolution is critical when reading documentation, crates, or training-data snippets:

| Era / Milestone | Key Architectural Shifts & Changelog Highlights |
| :--- | :--- |
| **GPUI 1 (2021–2023)** | Internal closed-source framework built for Zed on macOS (Metal). Relied on verbose explicit layout containers and early view/model split handles. |
| **GPUI 2 Rewrite & Open Source (Jan 2024)** | Complete architectural rewrite prior to Zed open-sourcing. Introduced **Tailwind-inspired fluent styling traits** (`Styled`, `ParentElement`, `InteractiveElement`), unified `IntoElement`, Taffy flexbox integration, and dynamic UI font scaling (`rem`/`px`). |
| **Cross-Platform Expansion (2024–2025)** | Added Linux (Wayland/X11 via Blade/Vulkan) and Windows (DirectX) backends. Introduced `uniform_list` virtualization, `canvas` element, and deterministic visual testing (`VisualTestContext`). |
| **Unified `Entity<T>` & `Context<T>` Overhaul (2025 — crates.io `0.2.x`)** | **Major Breaking API Modernization**: Consolidated legacy `Model<T>` and `View<T>` handles into a single unified **`Entity<T>`**. Renamed `AppContext` → **`App`**, `ModelContext<T>` / `ViewContext<T>` → **`Context<T>`**, and `cx.new_model` / `cx.new_view` → **`cx.new(...)`**. Render methods now take `(&mut self, window: &mut Window, cx: &mut Context<Self>)`. |
| **Ecosystem & WGPU Maturation (2025–2026)** | Rise of **`gpui-component`** (Longbridge's 60+ widget shadcn-inspired kit), **GPUI Community Edition (`gpui-ce`)**, and `wgpu` backend unification for standalone non-Zed desktop apps, financial trading terminals, and Discord/developer tooling architectures. |

---

## 3. Where GPUI Applies (Decision Matrix)

### Ideal Use Cases (✅ When to Choose GPUI)
- **Code Editors, IDEs & Log Viewers**: Sub-millisecond keystroke latency, custom text shaping, Tree-sitter syntax overlays, and 200K+ line virtualized buffers.
- **High-Frequency Financial & Telemetry Terminals**: Real-time order books, multi-pane dock workspaces, hardware-accelerated charts, and 120 FPS streaming tables (e.g., Longbridge Pro).
- **AI Coding Assistants & Agentic Consoles**: Native streaming Markdown/diff viewers, terminal emulators, and low-memory background daemons.
- **Game Engine Editors & Debug HUDs**: Node graphs, timeline scrubbers, asset browsers, and inspector drawers requiring direct GPU primitives.

### Framework Comparison (GPUI vs. Rust GUI Ecosystem)

| Requirement / Constraint | Recommended Framework | Why |
| :--- | :--- | :--- |
| **120 FPS native desktop, heavy text/panes, Tailwind-in-Rust ergonomics** | **GPUI** (+ `gpui-component`) | Direct GPU scene graph, Taffy flexbox, unified `Entity<T>` ownership, rich dock/editor primitives |
| **Reuse existing React/Vue/Svelte web codebase & npm packages** | **Tauri** | OS WebView + Rust backend IPC; fastest path for web teams |
| **Strict Elm architecture (`State` / `Message` / `update`) in pure Rust** | **Iced** | Mature Elm-style message loop; used by System76 COSMIC desktop |
| **Embedded microcontrollers (MCU) or declarative DSL separation** | **Slint** | Compiles `.slint` markup down to tiny footprint with software/GPU renderers |
| **Single Rust codebase targeting Web (WASM DOM), Mobile & Desktop** | **Dioxus** | React-like Virtual DOM and hooks (`use_signal`) across web/mobile/desktop |

---

## 4. Latest API & Migration Guardrails (CRITICAL)

> 🔴 **ANTI-STALE CODE RULE**: Many online examples and LLM weights still emit pre-2025 GPUI 0.1 syntax. **Always use the modern GPUI 0.2+ (`Entity<T>` / `App` / `Window` / `Context<T>`) API** unless maintaining a legacy pinned fork.

| Concept | ❌ Legacy GPUI (Deprecated / Pre-0.2) | ✅ Modern GPUI (Current Standard) |
| :--- | :--- | :--- |
| **Application Root** | `App::new().run(\|cx: &mut AppContext\| ...)` | `Application::new().run(\|cx: &mut App\| ...)` |
| **State / View Handle** | `View<MyView>` / `Model<MyState>` | `Entity<MyView>` / `Entity<MyState>` |
| **Weak Handle** | `WeakView<T>` / `WeakModel<T>` | `WeakEntity<T>` |
| **Creating Entities** | `cx.new_view(\|cx\| ...)` / `cx.new_model(\|cx\| ...)` | `cx.new(\|cx\| ...)` |
| **Context Types** | `AppContext`, `ViewContext<'_, T>`, `WindowContext` | `App`, `Context<'_, T>`, `Window` (passed explicitly) |
| **Render Signature** | `fn render(&mut self, cx: &mut ViewContext<Self>)` | `fn render(&mut self, window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement` |
| **RenderOnce Signature** | `fn render(self, cx: &mut WindowContext)` | `fn render(self, window: &mut Window, cx: &mut App) -> impl IntoElement` |
| **Listener Closure** | `cx.listener(\|this, event, cx\| ...)` | `cx.listener(\|this, event, window, cx\| ...)` |
| **Async Spawn** | `cx.spawn(\|this, mut cx\| async move { ... })` | `cx.spawn(async move \|this, cx\| { ... })` (or window-bound `window.spawn(cx, ...)`) |

---

## 5. Core Implementation Guidelines

### 5.1 Project Setup (`Cargo.toml`)

```toml
[package]
name = "my-gpui-app"
version = "0.1.0"
edition = "2024"

[dependencies]
gpui = "0.2"
gpui-component = "0.5" # Optional: 60+ production widgets (dock, table, input, modal, theme)
anyhow = "1.0"
serde = { version = "1.0", features = ["derive"] }
schemars = "0.8"

[dev-dependencies]
gpui = { version = "0.2", features = ["test-support"] }
```

> **Note on Linux / Windows**: Ensure platform system libraries are installed (e.g., `libxcb`, `libxkbcommon`, `vulkan-loader` on Linux; Windows 10/11 SDK with DirectX 12 on Windows).

### 5.2 Application Bootstrap & Window Creation

```rust
use gpui::{
    App, Application, Bounds, Context, Entity, IntoElement, ParentElement, Render,
    SharedString, Styled, Window, WindowBounds, WindowOptions, div, prelude::*, px, rgb, size,
};

pub struct WorkspaceView {
    title: SharedString,
}

impl Render for WorkspaceView {
    fn render(&mut self, _window: &mut Window, _cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .size_full()
            .bg(rgb(0x0d0f12))
            .text_color(rgb(0xedeef0))
            .items_center()
            .justify_center()
            .child(self.title.clone())
    }
}

fn main() {
    Application::new().run(|cx: &mut App| {
        // Optional: Initialize gpui-component theme & global registries
        // gpui_component::init(cx);

        let bounds = Bounds::centered(None, size(px(1200.0), px(800.0)), cx);
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_window, cx| {
                cx.new(|_cx| WorkspaceView {
                    title: "GPUI Production Console".into(),
                })
            },
        )
        .expect("failed to open main window");

        cx.activate(true);
    });
}
```

### 5.3 Entity Ownership, State Mutation & Observation

All state lives inside `Entity<T>`. Never hold `&mut T` across frames. Read with `.read(cx)` and mutate with `.update(cx, |state, cx| ...)`:

```rust
use gpui::{App, Context, Entity, EventEmitter, Subscription};

pub struct TelemetryStore {
    pub active_connections: usize,
    pub latency_ms: f32,
}

pub enum TelemetryEvent {
    ThresholdExceeded(f32),
}

impl EventEmitter<TelemetryEvent> for TelemetryStore {}

impl TelemetryStore {
    pub fn record_sample(&mut self, latency_ms: f32, cx: &mut Context<Self>) {
        self.latency_ms = latency_ms;
        if latency_ms > 100.0 {
            cx.emit(TelemetryEvent::ThresholdExceeded(latency_ms));
        }
        cx.notify(); // Marks this entity dirty and schedules dependent views to re-render
    }
}

pub struct DashboardPanel {
    store: Entity<TelemetryStore>,
    high_latency_alert: bool,
    _subscriptions: Vec<Subscription>,
}

impl DashboardPanel {
    pub fn new(store: Entity<TelemetryStore>, cx: &mut Context<Self>) -> Self {
        // 1. Observe state mutations (triggered by cx.notify() on store)
        let obs = cx.observe(&store, |_this, _store, cx| {
            cx.notify();
        });

        // 2. Subscribe to typed events (triggered by cx.emit(...) on store)
        let sub = cx.subscribe(&store, |this, _store, event: &TelemetryEvent, cx| {
            match event {
                TelemetryEvent::ThresholdExceeded(_) => {
                    this.high_latency_alert = true;
                    cx.notify();
                }
            }
        });

        Self {
            store,
            high_latency_alert: false,
            _subscriptions: vec![obs, sub], // Keep subscriptions alive for view lifetime!
        }
    }
}
```

> 🔴 **Subscription Lifetime Rule**: `cx.observe(...)` and `cx.subscribe(...)` return a `Subscription`. If dropped immediately, the listener is unregistered! Store them in a `Vec<Subscription>` field on your struct (or call `.detach()` only if the subscription should live as long as the entity itself).

### 5.4 Stateless Reusable Components (`RenderOnce` + `#[derive(IntoElement)]`)

Use **`RenderOnce`** for 90% of UI design-system building blocks (buttons, badges, cards, stat tiles). They consume `self` by value each frame with zero entity allocation overhead:

```rust
use gpui::{
    App, ClickEvent, ElementId, InteractiveElement, IntoElement, ParentElement, RenderOnce,
    SharedString, StatefulInteractiveElement, Styled, Window, div, prelude::*, px, rgb,
};

#[derive(IntoElement)]
pub struct StatusBadge {
    id: ElementId,
    label: SharedString,
    is_healthy: bool,
    on_click: Option<Box<dyn Fn(&ClickEvent, &mut Window, &mut App) + 'static>>,
}

impl StatusBadge {
    pub fn new(id: impl Into<ElementId>, label: impl Into<SharedString>) -> Self {
        Self {
            id: id.into(),
            label: label.into(),
            is_healthy: true,
            on_click: None,
        }
    }

    pub fn healthy(mut self, is_healthy: bool) -> Self {
        self.is_healthy = is_healthy;
        self
    }

    pub fn on_click(
        mut self,
        handler: impl Fn(&ClickEvent, &mut Window, &mut App) + 'static,
    ) -> Self {
        self.on_click = Some(Box::new(handler));
        self
    }
}

impl RenderOnce for StatusBadge {
    fn render(self, _window: &mut Window, _cx: &mut App) -> impl IntoElement {
        let (bg_color, fg_color) = if self.is_healthy {
            (rgb(0x0c7f63), rgb(0xedeef0))
        } else {
            (rgb(0xc42b2b), rgb(0xedeef0))
        };

        let mut el = div()
            .id(self.id)
            .flex()
            .items_center()
            .h(px(28.0))
            .px_3()
            .rounded(px(4.0))
            .bg(bg_color)
            .text_color(fg_color)
            .text_xs()
            .cursor_pointer()
            .hover(|style| style.opacity(0.9))
            .child(self.label);

        if let Some(handler) = self.on_click {
            el = el.on_click(move |ev, window, cx| handler(ev, window, cx));
        }

        el
    }
}
```

### 5.5 Styling, Layout (Taffy) & Design Tokens (`Global`)

GPUI implements Tailwind-equivalent methods directly via the `Styled` trait backed by Taffy Flexbox & Grid:

- **Units**: `px(16.0)` (logical pixels), `rems(1.0)` (scales with user font size), `relative(0.5)` (`50%`).
- **Colors**: `rgb(0x1e293b)`, `rgba(0x1e293bff)`, `hsla(h, s, l, a)`.
- **Conditional Styling**: Use `.when(condition, |this| ...)` and `.when_some(opt_val, |this, val| ...)` from `gpui::prelude::*` to avoid breaking method chains!

```rust
use gpui::{App, Global, Hsla, Rgba, SharedString, div, prelude::*, px, rgb};

#[derive(Clone)]
pub struct ThemeTokens {
    pub bg_canvas: Rgba,
    pub bg_surface: Rgba,
    pub border_line: Rgba,
    pub text_primary: Rgba,
    pub accent: Rgba,
    pub font_ui: SharedString,
    pub font_mono: SharedString,
}

impl Global for ThemeTokens {}

// Read anywhere in Render or RenderOnce:
// let theme = cx.global::<ThemeTokens>();
```

```rust
// Fluent conditional styling without breaking the builder chain:
div()
    .flex()
    .items_center()
    .justify_between()
    .h(px(36.0))
    .px_3()
    .border_1()
    .border_color(theme.border_line)
    .when(is_selected, |this| {
        this.bg(theme.accent).text_color(rgb(0xffffff))
    })
    .when_some(badge_count, |this, count| {
        this.child(format!("{count}"))
    })
```

### 5.6 Actions, Keybindings & Focus Management (`FocusHandle`)

Never hardcode raw keycodes inside widgets when an operation is semantic. Use **Actions** + **Key Contexts** + **`FocusHandle`**:

```rust
use gpui::{
    App, Context, FocusHandle, Focusable, InteractiveElement, IntoElement, KeyBinding,
    ParentElement, Render, Styled, Window, actions, div, prelude::*,
};

// 1. Define zero-payload actions or #[derive(Action)] structs
actions!(command_palette, [TogglePalette, ConfirmSelection, Cancel]);

pub struct CommandPalette {
    focus_handle: FocusHandle,
    is_open: bool,
}

impl Focusable for CommandPalette {
    fn focus_handle(&self, _cx: &App) -> FocusHandle {
        self.focus_handle.clone()
    }
}

impl CommandPalette {
    pub fn register_bindings(cx: &mut App) {
        cx.bind_keys([
            KeyBinding::new("ctrl-k", TogglePalette, Some("Workspace")),
            KeyBinding::new("escape", Cancel, Some("CommandPalette")),
        ]);
    }

    pub fn new(cx: &mut Context<Self>) -> Self {
        Self {
            focus_handle: cx.focus_handle(),
            is_open: false,
        }
    }

    fn toggle(&mut self, _: &TogglePalette, window: &mut Window, cx: &mut Context<Self>) {
        self.is_open = !self.is_open;
        if self.is_open {
            window.focus(&self.focus_handle);
        }
        cx.notify();
    }
}

impl Render for CommandPalette {
    fn render(&mut self, _window: &mut Window, cx: &mut Context<Self>) -> impl IntoElement {
        div()
            .key_context("CommandPalette")
            .track_focus(&self.focus_handle)
            .on_action(cx.listener(Self::toggle))
            .on_action(cx.listener(|this, _: &Cancel, _window, cx| {
                this.is_open = false;
                cx.notify();
            }))
    }
}
```

### 5.7 Async Tasks, Background Execution & Thread Safety

`App` is strictly single-threaded (main UI thread). Heavy CPU work, disk I/O, or blocking tasks **must** run on `cx.background_executor()` or `cx.background_spawn(...)`, then marshal results back via `WeakEntity::update`:

```rust
impl WorkspaceView {
    pub fn refresh_metrics(&mut self, cx: &mut Context<Self>) {
        cx.spawn(async move |this, cx| {
            // 1. Offload heavy parsing / IO to the background thread pool
            let parsed_rows = cx
                .background_spawn(async move {
                    // CPU-intensive work or file read
                    vec!["row-1".to_string(), "row-2".to_string()]
                })
                .await;

            // 2. Safely update entity on main thread if view still exists
            this.update(cx, |this, cx| {
                this.title = format!("Loaded {} rows", parsed_rows.len()).into();
                cx.notify();
            })
            .ok();
        })
        .detach();
    }
}
```

> 🔴 **Task Cancellation Pattern**: `cx.spawn(...)` returns a `Task<R>`. Dropping a `Task<R>` **cancels** the future immediately! For debounced search or cancellable requests, store `pending_task: Option<Task<()>>` on your view struct—assigning a new task automatically drops and cancels the previous one.

### 5.8 List Virtualization (`uniform_list`) & Custom Drawing (`canvas`)

- **Never render 1,000+ children directly in `.children(...)`**. Use `uniform_list` for fixed-row-height lists or `list` (`ListState`) for variable-height virtualized feeds.
- Use `canvas(prepaint, paint)` for custom vector charts, node wires, or GPU quads without implementing the full `Element` boilerplate.

```rust
use gpui::{Context, IntoElement, ParentElement, Render, Styled, Window, div, px, uniform_list};

// Inside Render::render:
uniform_list(
    "log-stream-list",
    self.logs.len(),
    cx.processor(|this, range: std::ops::Range<usize>, _window, _cx| {
        range
            .map(|ix| {
                let entry = &this.logs[ix];
                div()
                    .h(px(28.0)) // Uniform height required
                    .flex()
                    .items_center()
                    .px_3()
                    .child(entry.clone())
            })
            .collect()
    }),
)
.size_full()
```

---

## 6. Using `gpui-component` for Rapid Enterprise UI

When building full desktop applications (settings modals, virtualized data tables, dockable split panes, resizable sidebars, LSP code editors, or Markdown views), pair `gpui` with **`gpui-component`**:

1. **Initialize at startup**: Call `gpui_component::init(cx)` inside `Application::new().run(...)`.
2. **Wrap window root**: Use `Root::new(view, window, cx)` so modals, drawers, notifications, and tooltips have a top-level overlay layer.
3. **Use built-in primitives**:
   - **Layout**: `DockArea` (multi-pane tabs/splits), `ResizablePanelGroup`, `Sidebar`, `TitleBar`.
   - **Data**: `Table` (virtualized sorting/column resizing), `VirtualList`, `Tree`.
   - **Inputs**: `InputState` / `TextInput`, `Select`, `DatePicker`, `Switch`, `Slider`, `OtpInput`.
   - **Feedback**: `Modal`, `Drawer`, `Popover`, `Tooltip`, `Notification`.

---

## 7. Deterministic Testing (`#[gpui::test]` & `VisualTestContext`)

GPUI includes a deterministic single-threaded test executor that simulates async timers, background threads, window layout, and keyboard/mouse input without flakiness:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use gpui::{TestAppContext, VisualTestContext};

    #[gpui::test]
    async fn test_telemetry_threshold_alert(cx: &mut TestAppContext) {
        let store = cx.new(|_cx| TelemetryStore {
            active_connections: 4,
            latency_ms: 12.0,
        });

        let panel = cx.new(|cx| DashboardPanel::new(store.clone(), cx));

        // Mutate model and flush reactive notifications deterministically
        store.update(cx, |s, cx| s.record_sample(145.0, cx));
        cx.run_until_parked();

        panel.read_with(cx, |p, _cx| {
            assert!(p.high_latency_alert, "panel should flag high latency");
        });
    }
}
```

---

## 8. Anti-Patterns & Performance Checklist

| ❌ Anti-Pattern | ✅ GPUI Best Practice |
| :--- | :--- |
| Using `Arc<Mutex<T>>` or `Rc<RefCell<T>>` for UI state | Store state in `Entity<T>` and coordinate via `cx.update` / `cx.observe` / `cx.subscribe` |
| Allocating `String` on every frame in `render()` | Use **`SharedString`** (`"literal".into()` is zero-copy `'static` or `Arc<str>`) |
| Dropping `Subscription` or `Task` unintentionally | Store `Vec<Subscription>` on the view struct; store `Option<Task<()>>` for cancellable work |
| Running blocking HTTP/SQLite/file I/O on `App` thread | Dispatch to `cx.background_spawn(...)` so the 120 FPS render loop never stalls |
| Forgetting `.id("...")` on interactive or scrollable divs | Always call `.id("unique-id")` to unlock `StatefulInteractiveElement` (`on_click`, `overflow_y_scroll`, `tooltip`) |
| Forgetting `cx.notify()` after mutating state in a listener | Call `cx.notify()` whenever view-visible state changes so GPUI schedules a frame |
