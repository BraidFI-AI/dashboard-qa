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

---

## 2026-02-14: Test Generation Method - Option 3 (Generator Script)

**Decision**: Implement test file generation using Node.js script (`test-automation/scripts/generate-tests.js`)

**Alternatives Considered**:
- Option 1: Create files one-by-one with create_file tool (manual, not scalable)
- Option 2: Provide templates for manual creation (inconsistent)
- Option 3: Generator script (chosen)

**Rationale**: Reproducible and scalable foundation for team use. Can be used by other developers and CI/CD infrastructure. Version-controlled test specifications (TEST_SPECS array) serve as source of truth. Ensures consistent structure across all test files. Extensible for future test additions.

**Outcome**: Successfully generated 5 test files (02-06) with consistent role-tagged structure. Script is npm-integrated (`npm run generate-tests`) and documented in test-generator-guide.md.

---

## 2026-02-14: Documentation Naming Convention - Lowercase (Except README.md)

**Decision**: Use lowercase naming for all markdown documentation files except README.md

**Context**: User preference expressed after INFRA-REQUEST.md was created in uppercase

**Implementation**:
- Renamed: ROLE-ARCHITECTURE-PROPOSAL.md → role-architecture-proposal.md
- Renamed: TEST-GENERATOR-GUIDE.md → test-generator-guide.md
- Renamed: FOUNDATION-REBUILD-PLAN-COMPLETED.md → foundation-rebuild-plan-completed.md
- Renamed: INFRA-REQUEST.md → infra-request.md
- Kept: README.md (uppercase by user request)

**Rationale**: Consistency across project, user preference for lowercase naming improves discoverability and reduces case-sensitivity issues across different filesystems.

---

## 2026-02-14: Test Execution Blocked by 2FA

**Blocker Identified**: Test user account has 2FA enabled, automated tests cannot handle TOTP codes

**Decision**: Document blocker and create infrastructure request for dedicated test account

**Technical Constraint**: Playwright (and all browser automation tools) cannot programmatically retrieve time-based 2FA codes without security bypass mechanisms

**Resolution Path**:
- Infrastructure team must create Cognito user with DEVELOPER_ROUTE role
- Account must have 2FA disabled (security mitigated by tenant isolation and test environment)
- Created `test-automation/infra-request.md` with complete specifications and security justification

**Status**: Test infrastructure 100% ready, waiting on infrastructure team for credentials

**Alternative Rejected**: Using API-only tests instead of UI tests - would not validate user-facing workflows and actual browser interactions
