---
name: rust-pro
description: Master modern Rust (1.100+ / 2024 Edition) with async closures, let chains, RPIT precise capturing, structured Tokio concurrency, advanced type system features, and production-ready systems programming. Use PROACTIVELY for Rust development, performance optimization, or systems programming.
when_to_use: "When writing Rust code, working with .rs files, Cargo.toml, Cargo.lock, Tokio, axum, or any Rust ecosystem tools."
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
version: 1.100.0
---

# Rust Pro — Modern Rust (1.100+ / 2024 Edition)

> Build memory-safe, zero-cost, high-concurrency Rust services and systems software using **Rust 2024 Edition** and **Rust 1.85–1.100+** idioms.

---

## Use This Skill When

- Building Rust backend services, CLIs, libraries, or low-level systems tooling
- Designing async pipelines, Tokio services, or lock-free / concurrent data structures
- Resolving ownership, lifetime, `Pin`, `Send`/`Sync`, or trait-bound design issues
- Auditing `unsafe` / FFI boundaries or optimizing memory layout and CPU hotspots
- Migrating legacy Rust 2018/2021 codebases to Rust 2024 Edition & 1.100+ stdlib

## Do Not Use This Skill When

- You are building GPUI native desktop interfaces primarily — pair with `@gpui`
- You only need a quick shell one-liner or cannot introduce Rust into the stack

## Instructions

1. **Target `edition = "2024"` and `resolver = "3"`** in `Cargo.toml` (unless pinned to an older MSRV).
2. **Prefer standard library & built-in language features** (`LazyLock`, `OnceLock`, `async || {}`, `let` chains, `cfg_select!`, `!`, `DropGuard`) before adding legacy crates.
3. **Design explicit ownership & error boundaries** (`thiserror` v2 for libraries, `anyhow` / `eyre` for binaries; zero `.unwrap()` in production paths).
4. **Verify every change** with `cargo clippy --all-targets -- -D warnings`, `cargo nextest run` (or `cargo test`), and `cargo audit` / `cargo deny`.

---

## 1. Anti-Stale Migration Guardrails (CRITICAL)

> 🔴 **ANTI-STALE RULE**: Do not emit pre-2024 workarounds when targeting modern Rust (1.85–1.100+ / 2024 Edition).

| Concept | ❌ Legacy / Deprecated Pattern | ✅ Modern Rust (2024 / 1.85–1.100+) |
| :--- | :--- | :--- |
| **Global lazy init** | `lazy_static!` or `once_cell::sync::Lazy` | `std::sync::LazyLock` / `OnceLock` |
| **Async closures** | `\|\| async move { ... }` (cannot borrow cleanly) | `async \|\| { ... }` with `AsyncFn` / `AsyncFnMut` / `AsyncFnOnce` (1.85+) |
| **Nested `if let`** | Deeply nested `if let Some(a) = x { if let Ok(b) = y { ... } }` | `if let Some(a) = x && let Ok(b) = y && b > 0 { ... }` (`let_chains`, 1.88 / 2024) |
| **Conditional `if let` match** | Extra `match` inside arm | `if let` guards in `match` arms (1.95+) |
| **Trait async methods** | `#[async_trait]` everywhere | Native `async fn` in traits (static dispatch); keep `async_trait` / `BoxFuture` only for `dyn Trait` |
| **RPIT lifetime capture** | Unintended captures or dummy lifetime hacks | Explicit `-> impl Trait + use<'a, T>` precise capturing (1.87+) |
| **Trait object upcasting** | Manual `fn as_super(&self) -> &dyn Super` | Direct coercion `sub_ref as &dyn Super` (1.86+) |
| **Multi-element mut borrow** | `split_at_mut` index arithmetic or `unsafe` | `slice.get_disjoint_mut([i, j])` / `HashMap::get_disjoint_mut` (1.86+) |
| **Cfg branching** | `cfg_if::cfg_if! { ... }` crate | `std::cfg_select! { ... }` (1.95+) |
| **Never / diverging type** | `std::convert::Infallible` workarounds | Native `!` never type (`Infallible` is alias for `!`, 1.100+) |
| **Scope exit cleanup** | Custom RAII `struct Guard` boilerplate | `std::mem::DropGuard` with `.dismiss()` (1.100+) |
| **Unsafe extern / naked** | Unmarked `extern "C"` / `#[naked]` | `unsafe extern "C" { ... }` (2024) and `#[unsafe(naked)]` (1.88+) |
| **Coverage & test runner** | `cargo tarpaulin` / slow serial `cargo test` | `cargo llvm-cov` and `cargo nextest run` |

---

## 2. Modern Language & Type System (2024 Edition – 1.100)

### 2.1 Ergonomic Control Flow & Borrowing
```rust
// Let chains (Rust 1.88+, 2024 Edition) — flattens validation pipelines
pub fn authorize_user(req: &Request) -> Result<UserId, AuthError> {
    if let Some(header) = req.headers().get("authorization")
        && let Ok(token) = header.to_str()
        && let Some(jwt) = token.strip_prefix("Bearer ")
    {
        return verify_jwt(jwt);
    }
    Err(AuthError::Unauthorized)
}

// Disjoint mutable borrows (Rust 1.86+)
if let Ok([a, b]) = items.get_disjoint_mut([idx_a, idx_b]) {
    std::mem::swap(a, b);
}

// Explicitly inferred const generics (Rust 1.89+)
let scratch: [u8; 4096] = [0; _];
```

### 2.2 RPIT Precise Capturing & Async Closures
```rust
// Capture only `'a` and `T`, freeing unrelated lifetimes in callers (Rust 1.87+)
fn iter_items<'a, T, U>(
    slice: &'a [T],
    _config: &U,
) -> impl Iterator<Item = &'a T> + use<'a, T> {
    slice.iter()
}

// Native async closures borrowing from caller (Rust 1.85+)
async fn with_retry<F>(mut op: F) -> Result<(), AppError>
where
    F: AsyncFnMut() -> Result<(), AppError>,
{
    for attempt in 0..3 {
        if op().await.is_ok() {
            return Ok(());
        }
        tokio::time::sleep(std::time::Duration::from_millis(50 * (1 << attempt))).await;
    }
    op().await
}
```

### 2.3 Type-System Safety Patterns
- **Newtype + Typestate:** Encode invariants at compile time (`struct Unverified; struct Verified; struct Email<State>(String, PhantomData<State>);`) so invalid states are unrepresentable.
- **Zero-Sized Types (ZSTs) & Marker Traits:** Gate privileged operations with capability tokens (`struct AdminCap(());`) instead of runtime booleans.
- **Custom Allocators & `DropGuard` (1.100+):** Use `std::mem::DropGuard` for rollback paths in multi-step mutations, calling `guard.dismiss()` on commit.

---

## 3. Async Programming & Tokio Concurrency

### 3.1 Non-Negotiable Async Guardrails
1. **Never block the Tokio executor:** Offload CPU-bound work (`rayon` or `tokio::task::spawn_blocking`) and sync I/O (`std::fs`, blocking DB drivers).
2. **Never hold a `std::sync::Mutex` across `.await`:** Use `tokio::sync::Mutex` only when a lock *must* span an `.await`; otherwise scope `std::sync::Mutex` (or `parking_lot::Mutex`) strictly to synchronous blocks before `.await`.
3. **Cancellation safety in `tokio::select!`:** Every branch in `select!` can be dropped mid-flight. Never put non-cancellation-safe futures (e.g., partial `read_buf` + state mutation) inline without `tokio::pin!` or `CancellationToken` structured shutdown.
4. **Structured concurrency:** Prefer `tokio::task::JoinSet` or `futures::stream::FuturesUnordered` with bounded concurrency (`buffer_unordered(N)`) over fire-and-forget `tokio::spawn`.
5. **Backpressure:** Always use bounded channels (`tokio::sync::mpsc::channel(cap)`). Reserve `watch` for latest-state snapshots and `broadcast` for fan-out events.

```rust
use tokio_util::sync::CancellationToken;

pub async fn run_worker(token: CancellationToken, mut rx: tokio::sync::mpsc::Receiver<Job>) {
    loop {
        tokio::select! {
            biased;
            _ = token.cancelled() => break,
            maybe_job = rx.recv() => {
                let Some(job) = maybe_job else { break };
                process_job(job).await;
            }
        }
    }
}
```

---

## 4. Error Handling & Ecosystem Matrix

### 4.1 Error Strategy
- **Libraries / Domain Modules:** Use `thiserror` (v2) with typed enum variants (`#[from]`, `#[error(...)]`). Never erase library errors into `anyhow::Error`.
- **Binaries / Services / Handlers:** Use `anyhow` (or `eyre` / `color-eyre`) with `.context("...")` at application boundaries, mapping domain errors to structured HTTP/gRPC status codes (`IntoResponse` in `axum`).
- **Zero Panic Policy:** Never use `.unwrap()` or `.expect()` in request/library paths; reserve `.expect("invariant: ...")` strictly for provable compile-time invariants or startup config.

### 4.2 Modern Crate Selection (2025–2026)

| Domain | Recommended Crates | Notes |
| :--- | :--- | :--- |
| **Web / HTTP** | `axum` + `tower` + `tower-http` + `hyper` (v1) | Idiomatic extractors, `Router` state, middleware |
| **gRPC / RPC** | `tonic` | HTTP/2 + protobuf codegen |
| **Database** | `sqlx` (compile-time checked SQL) or `sea-orm` / `diesel` | Prefer `sqlx::query!` for raw SQL safety |
| **Serialization** | `serde` + `serde_json`, `postcard` (embedded), `rkyv` / `zerocopy` (zero-copy) | Use `#[serde(deny_unknown_fields)]` on strict configs |
| **Observability** | `tracing` + `tracing-subscriber` + `opentelemetry` | Structured spans (`#[tracing::instrument(skip(pool))]`) |
| **CLI** | `clap` (derive) | Pair with `indicatif` / `console` if interactive |
| **Sync / Lock-free** | `parking_lot`, `dashmap`, `crossbeam`, `arc-swap` | Benchmark before replacing `std::sync` |
| **Testing** | `cargo-nextest`, `proptest`, `mockall`, `wiremock`, `insta` | Snapshot + property tests for parsers/APIs |

---

## 5. `unsafe`, FFI & Performance Engineering

### 5.1 `unsafe` & FFI Discipline
- **Minimize and isolate:** Wrap `unsafe` in a small, safe module boundary so invariants are enforced by types and visibility.
- **Mandatory `// SAFETY:` comments:** Every `unsafe { ... }` block and `unsafe fn` must document the exact invariants the caller/context guarantees.
- **2024 Edition FFI:** Always wrap external blocks in `unsafe extern "C" { ... }` and mark safe FFI declarations explicitly with `safe fn` where appropriate.
- **Uninitialized memory:** Use `MaybeUninit<T>` and `ptr::addr_of_mut!`—never `mem::uninitialized()` or `&mut` to uninitialized data.
- **Verify with Miri:** Run `cargo +nightly miri test` on all `unsafe` data structures and FFI wrappers to catch UB, stacked/tree borrows violations, and alignment bugs.

### 5.2 Performance & Memory Layout
- **Measure first:** Profile with `cargo flamegraph`, `samply`, or `perf` before optimizing; benchmark with `criterion` or `divan` (`#[divan::bench]`).
- **Cache locality & layout:** Order struct fields by descending alignment or use `#[repr(C)]` only for FFI; avoid `Box<dyn Trait>` in tight loops—prefer generics or `enum` dispatch (`enum_dispatch`).
- **Zero-allocation hot paths:** Reuse buffers (`String::clear()`, `Vec::clear()`), pass slices (`&[T]`, `&str`), use `Cow<'_, str>`, and `SmallVec` / `ArrayVec` for bounded stack storage.
- **SIMD:** Use `std::simd` (`portable_simd` on nightly) or `wide` / `pulp` on stable with safe `#[target_feature]` (1.86+).

---

## 6. Cargo Hygiene, Linting & Supply-Chain Security

### 6.1 Recommended `Cargo.toml` Workspace Setup
```toml
[workspace]
resolver = "3"

[workspace.package]
edition = "2024"
rust-version = "1.100"

[workspace.lints.rust]
unsafe_op_in_unsafe_fn = "deny"
mismatched_lifetime_syntaxes = "warn"

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
pedantic = { level = "warn", priority = -1 }
unwrap_used = "deny"
expect_used = "warn"
dbg_macro = "deny"
```

### 6.2 Quality & Security Gates
- **Format & Lint:** `cargo fmt --check` and `cargo clippy --all-targets --all-features -- -D warnings`
- **Fast Parallel Tests:** `cargo nextest run` (plus `cargo test --doc` for doctests)
- **Coverage:** `cargo llvm-cov --lcov --output-path lcov.info`
- **Supply Chain (Rust 1.100+):**
  - Enable `min-publish-age` in `.cargo/config.toml` (`[resolver]`) to mitigate newly published compromised crates.
  - Fix unused dependency warnings flagged by Cargo 1.100+.
  - Run `cargo audit` (RustSec advisories) and `cargo deny check` (licenses, bans, sources).
  - Run `cargo semver-checks` before publishing library crates.

---

## Response Approach

1. **Clarify constraints:** Target Rust edition/MSRV, runtime (`tokio` vs `smol` vs `no_std`), and latency/memory budgets.
2. **Design with the type system:** Model invariants via enums, newtypes, and ownership before writing logic.
3. **Write idiomatic 2024/1.100+ Rust:** Use `let` chains, `LazyLock`, `async || {}`, and structured error types; zero `.unwrap()` in prod code.
4. **Verify via toolchain:** Run `cargo check`, `cargo clippy`, `cargo nextest run` / `cargo test`, and `miri` (for `unsafe`)—report real command output.
