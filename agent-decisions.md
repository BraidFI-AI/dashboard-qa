# Agent Decisions Log

## 2026-02-13: Testing Framework Selection

**Decision**: Use Vitest instead of Jest for unit/UI tests  
**Rationale**: Native ESM support, faster execution with Vite, better Next.js 15 compatibility, built-in TypeScript support without additional config. Dashboard already uses Vite toolchain indirectly through modern build pipeline.

---

## 2026-02-13: E2E Framework Selection

**Decision**: Use Playwright instead of Cypress  
**Rationale**: Better multi-browser support (Chromium, Firefox, WebKit), built-in test parallelization, auto-wait mechanism reduces flaky tests, better debugging tools, works with real HTTP calls to Braid test API without additional proxy setup.

---

## 2026-02-13: API Mocking Strategy

**Decision**: Use Mock Service Worker (MSW) 2.x for Unit/UI tests  
**Rationale**: Intercepts requests at network level (not Axios level), works in both Node.js and browser environments, allows gradual migration to real API calls, maintains consistency between unit and integration test mocks. E2E tests bypass MSW entirely and hit real Braid test API.

---

## 2026-02-13: Three-Workflow Testing System

**Decision**: Separate GitHub Actions workflows for Unit, UI, and E2E tests  
**Rationale**: Independent failure isolation (unit failures don't block E2E), different execution times (3-5min vs 25-30min), staggered schedules prevent resource contention, allows targeted re-runs without running full suite.

**Tradeoff**: More complex CI/CD setup vs simpler single workflow. Chose complexity for better observability and faster feedback loops.

---

## 2026-02-13: Test Data Strategy

**Decision**: Stable test grouping in Braid test API (not dynamic create/destroy)  
**Rationale**: Avoids foreign key dependency hell (Program → Product → Account → Transaction chain), prevents test pollution from orphaned entities, allows parallel test execution without conflicts, matches production-like data patterns.

**Tradeoff**: Requires one-time manual setup and pre-run state reset vs fully automated setup. Chose stability over automation complexity.

---

## 2026-02-13: Test Case Methodology

**Decision**: Rule of Three - every testable unit requires exactly 3 cases (Happy Path, Edge Cases, Ugly Cases)  
**Rationale**: Predictable coverage pattern, easy to review completeness, AI agents can validate adherence automatically, prevents under-testing and over-testing extremes.

---

## 2026-02-13: DOM Environment

**Decision**: Install both jsdom and happy-dom  
**Rationale**: jsdom for standard compatibility, happy-dom for faster execution. Allows per-test-suite optimization based on needs. Plan to use happy-dom for unit tests (speed), jsdom for UI tests (compatibility with Testing Library).
