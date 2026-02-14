# Agent Context - Core Web Dashboard QA Automation

## Testing Infrastructure

### Installed Dependencies (as of 2026-02-13)
- **Unit Testing**: vitest@4.0.18, @vitest/ui@4.0.18
- **E2E Testing**: @playwright/test@1.58.2 (browsers: Firefox 146.0.1, WebKit 26.0)
- **API Mocking**: msw@2.12.10
- **React Testing**: @testing-library/react@16.3.2, @testing-library/jest-dom@6.9.1, @testing-library/user-event@14.6.1
- **DOM Environments**: jsdom@28.0.0, happy-dom@20.6.1

### Available NPM Scripts
```bash
npm run test:unit         # Run unit tests once
npm run test:ui           # Run UI tests with MSW
npm run test:e2e          # Run E2E tests with Playwright
npm run test:all          # Run all test suites
```

### Testing Documentation
- Comprehensive plan lives in `/test-automation/agent-qa-plan.md` (620 lines)
- OpenAPI spec analyzed in `/test-automation/braid-open-api-1.8.json` (110 endpoints)
- Three-workflow system: Unit (2AM UTC), UI (2:30AM UTC), E2E (3AM UTC)
- Test case strategy: Rule of Three (Happy Path, Edge Cases, Ugly Cases)

### Test Data Architecture
- **Approach**: Stable test grouping in Braid test API (not dynamic create/destroy)
- **Entity Hierarchy**: Program(1001) → Product(2001-2003) → Account(5001-5006) → Transaction
- **Test Manifest**: `test-grouping-manifest.json` references persistent entities with API-compliant IDs

### Pending Implementation
- Configuration files: `vitest.config.ts`, `vitest.ui.config.ts`, `playwright.config.ts`
- Mock infrastructure: AWS Amplify, ApiClient, Next.js navigation mocks
- Test utilities: Redux/React Query wrappers
- GitHub Actions workflows: `.github/workflows/*-tests-daily.yml`
- AI analysis agents: Result parsing, Jira ticket creation, daily digest
