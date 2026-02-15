# Infrastructure Request: Test User for E2E Automation

**Date:** February 14, 2026  
**Requestor:** [Your Team]  
**Priority:** Medium  
**Blocker:** E2E test automation cannot run without this account

---

## Request Summary

Create a Cognito user account for automated E2E testing with 2FA disabled.

---

## Account Specifications

| Property | Value |
|----------|-------|
| **Username** | `qagentuser-test` (or per your naming convention) |
| **Password** | [Infrastructure team to generate and provide securely] |
| **Role** | Fintech Admin (DEVELOPER_ROUTE / developer-admin) |
| **Tenant** | Test tenant (isolated from production) |
| **Product ID** | 1069832 (existing test product) |
| **2FA** | ❌ **DISABLED** (required for automation) |
| **Access** | Dashboard login only (tenant-scoped) |

---

## Why 2FA Must Be Disabled

**Technical Limitation:**
- Automated tests use Playwright browser automation
- TOTP codes are time-based and change every 30 seconds
- Tests cannot access authenticator apps or SMS
- No way to programmatically retrieve 2FA codes without security bypass

**Industry Standard:**
- All test automation platforms (Selenium, Playwright, Cypress) require test accounts without 2FA
- Common practice: dedicated test accounts with restricted scope instead of 2FA

---

## Security Considerations

### Mitigations
✅ **Account Isolation**
- Test account restricted to test tenant only
- Cannot access production data
- Separate from production users

✅ **Limited Scope**
- Same permissions as regular Fintech Admin (not elevated)
- Tenant-scoped (can only see own tenant data)
- No access to admin-only features (settlement, programs)

✅ **Monitoring**
- Account activity logged in Cognito
- Can alert on unusual patterns
- Used only from CI/CD systems (predictable IPs)

✅ **Credential Management**
- Password stored in `.env.local` (not committed to git)
- Can be rotated regularly
- Only accessible to authorized team members

### Risk Assessment
**Risk Level:** Low
- Equivalent to any other Fintech Admin user
- Test tenant has no production data
- Account activity fully auditable

---

## Use Case

**Purpose:** Automated E2E UI testing
- 86 test cases covering dashboard workflows
- Tests customer management, transactions, ACH, compliance pages
- Can run daily during off-hours (2:00 AM UTC)
- Validates UI functionality after deployments

**Test Coverage:**
- ✅ 49 Shared tests (common workflows)
- ✅ 17 Fintech Admin tests (tenant isolation)
- 🚧 20 Bank Admin tests (future, requires admin credentials)

---

## Deliverables

Please provide:

1. **Username** (confirmed Cognito username)
2. **Password** (provide securely via [your secure channel])
3. **Tenant ID** (for verification)
4. **Confirmation** that 2FA is disabled

Send credentials to: [your team contact]

---

## Timeline

**Requested by:** [Date needed]
**Estimated setup time:** 15-30 minutes

---

## Alternative Solutions Considered

❌ **Option: Use existing user with 2FA**
- Not possible: Tests cannot handle TOTP codes

❌ **Option: API-only testing (skip UI)**
- Changes test scope significantly
- Need UI validation for user-facing features

❌ **Option: Manual testing only**
- Defeats purpose of automation
- Cannot run tests in CI/CD pipeline

✅ **Option: Dedicated test account without 2FA** ⭐ **RECOMMENDED**
- Industry standard approach
- Secure within test environment
- Enables full automation

---

## Questions?

Contact: [Your contact info]

Documentation: See `test-automation/README.md` and `e2e/README.md`

---

## Once Account Is Provided

We will:
1. Update `.env.local` with credentials
2. Run test suite to verify
3. Configure CI/CD pipeline for automated runs
4. Provide test results dashboard

**Test infrastructure is 100% ready and waiting for credentials.** 🚀
