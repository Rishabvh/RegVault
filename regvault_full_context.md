# RegVault — Complete Project Context Transfer Document

> **Generated**: 2026-09-06  
> **Purpose**: Full context handoff to another AI model  
> **Owner**: Rishab Hudlikar (Risk Advisory Consultant, Cybersecurity & InfoSec background)

---

## 1. PROJECT OVERVIEW

**RegVault** is a web dashboard for Indian regulatory circulars focused on **Cybersecurity, Information Security, IT Governance, and Compliance**. It aggregates circulars from Indian financial/identity regulators (RBI, SEBI, IRDAI, NPCI, UIDAI) into a single searchable interface.

- **Repo**: https://github.com/Rishabvh/RegVault.git
- **Hosting**: Vercel (3 environments: dev, uat, prod mapped to branches)
- **Tech stack**: Vanilla JS SPA + Vite (zero runtime dependencies)
- **Local path**: `d:\Projects\P1`

---

## 2. GIT STATE

- **Current branch**: `dev`
- **Branches**: `main`, `uat`, `dev` (local + remote)
- **Latest commit**: `7e6e6fc` — "ci: add vercel.json for multi-environment deployments (dev/uat/prod)"
- **Status**: Clean, stable. A previous failed update was rolled back to this commit.

### Commit History
```
7e6e6fc ci: add vercel.json for multi-environment deployments (dev/uat/prod)
78f9615 merge: resolve README conflict, keep full project README
9b78a0b docs: update README with correct GitHub repo URL
27e1d22 Initial commit
e42078e feat: RegVault v1 — Indian Regulatory Circulars Dashboard for Cybersecurity & InfoSec
```

### Deployment Workflow
- All changes go to `dev` first → test → merge to `uat` → test → merge to `main` (production)
- Vercel auto-deploys on push to any of the 3 branches

---

## 3. PROJECT STRUCTURE

```
d:\Projects\P1\
├── .git/
├── .gitignore                    (50 B)
├── README.md                     (4,446 B)
├── dist/                         (built output)
│   ├── assets/
│   ├── favicon.svg
│   └── index.html
├── index.html                    (3,973 B)     ← Entry HTML
├── node_modules/
├── package-lock.json             (35,953 B)
├── package.json                  (418 B)
├── public/
│   └── favicon.svg               (949 B)
├── src/
│   ├── main.js                   (8,238 B)     ← SPA router, theme, renderCircularCard()
│   ├── data/
│   │   └── circulars.json        (36,513 B)    ← ALL circular data (39 entries)
│   ├── pages/
│   │   ├── dashboard.js          (6,587 B)     ← Dashboard / landing page
│   │   ├── regulator.js          (7,340 B)     ← Regulator detail page
│   │   └── search.js             (6,094 B)     ← Search results page
│   ├── styles/
│   │   └── index.css             (29,644 B)    ← Complete design system
│   └── utils/
│       ├── search.js             (4,782 B)     ← Search & filter engine
│       └── storage.js            (3,621 B)     ← localStorage utilities
├── vercel.json                   (263 B)
└── vite.config.js                (196 B)
```

### Key Architectural Facts
- **100% static SPA** — No backend, no API, no serverless functions
- **Zero runtime dependencies** — Only Vite as dev dependency
- **Hash-based routing**: `#/`, `#/regulator/{id}`, `#/search?q=...`
- **Data source**: Single `circulars.json` fetched at app init via `fetch()`
- **State**: localStorage for theme, recent accessed, search history
- **5 regulators hardcoded** in dashboard.js and regulator.js: RBI, SEBI, IRDAI, NPCI, UIDAI

---

## 4. CONFIGURATION FILES

### package.json
```json
{
  "name": "regvault",
  "version": "1.0.0",
  "description": "RegVault — Indian Regulatory Circulars Dashboard for Cybersecurity & Information Security",
  "author": "Rishab Hudlikar (Risk Advisory Consultant)",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

### vite.config.js
```js
import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: { port: 3000, open: true },
});
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "git": {
    "deploymentEnabled": { "main": true, "uat": true, "dev": true }
  }
}
```

---

## 5. DATA SCHEMA (circulars.json)

Each circular entry follows this schema:
```json
{
  "id": "rbi-001",                              // Unique ID: {regulator}-{number}
  "regulator": "RBI",                            // Short code: RBI, SEBI, IRDAI, NPCI, UIDAI
  "regulatorFullName": "Reserve Bank of India",   // Display name
  "name": "...",                                  // Circular title
  "documentId": "...",                            // Official document reference number
  "category": "Cybersecurity Framework",          // Category label
  "dateIssued": "2016-06-02",                     // ISO date
  "url": "https://...",                           // Circular webpage URL (for "View")
  "pdfUrl": "https://...",                        // PDF/document URL (for "Download")
  "description": "...",                           // Summary text
  "tags": ["..."],                                // Array of keyword tags
  "applicableTo": ["..."]                         // Array of applicable entity types
}
```

### Current Data Summary (39 total entries)

| Regulator | Count | IDs | Status |
|-----------|-------|-----|--------|
| **RBI** | 12 | rbi-001 to rbi-012 | ✅ URLs work correctly |
| **SEBI** | 8 | sebi-001 to sebi-008 | ❌ Many URLs return 404 or broken pages |
| **IRDAI** | 6 | irdai-001 to irdai-006 | ❌ All URLs point to generic `irdai.gov.in/circulars` listing page |
| **NPCI** | 8 | npci-001 to npci-008 | ⚠️ URLs point to generic circulars listing pages |
| **UIDAI** | 7 | uidai-001 to uidai-007 | ❌ All URLs point to generic `authentication-devices-documents.html` page |

---

## 6. COMPLETE CIRCULARS DATA (Current State)

### RBI (12 entries — WORKING)

| ID | Name | Date | Category |
|----|------|------|----------|
| rbi-001 | Cyber Security Framework in Banks | 2016-06-02 | Cybersecurity Framework |
| rbi-002 | Master Direction on IT Governance, Risk, Controls and Assurance | 2023-11-07 | IT Governance |
| rbi-003 | Master Direction on Digital Payment Security Controls | 2021-02-18 | Payment Security |
| rbi-004 | IT Framework for the NBFC Sector | 2015-06-08 | IT Governance |
| rbi-005 | Comprehensive Cyber Security Framework for Primary (Urban) Cooperative Banks | 2019-12-31 | Cybersecurity Framework |
| rbi-006 | Guidelines on Managing Risks and Code of Conduct in Outsourcing of Financial Services | 2006-11-03 | IT Outsourcing |
| rbi-007 | Tokenisation – Card Transactions: Permitting CoFT as TSP | 2021-09-07 | Tokenization |
| rbi-008 | Storage of Payment System Data – Data Localisation | 2018-04-06 | Data Localization |
| rbi-009 | Master Direction on Outsourcing of IT Services | 2023-04-10 | IT Outsourcing |
| rbi-010 | Framework for Regulation of Payment Aggregators and Payment Gateways | 2020-03-17 | Payment Security |
| rbi-011 | Master Direction on Cyber Resilience and Digital Payment Security Controls for PSOs | 2024-04-30 | Cybersecurity Framework |
| rbi-012 | Reporting of Cyber Security Incidents – Revised Timeline | 2022-06-14 | Incident Reporting |

### SEBI (8 entries — BROKEN URLs)

| ID | Name | Date | Category | Current URL |
|----|------|------|----------|-------------|
| sebi-001 | CSCRF for SEBI Regulated Entities | 2023-12-20 | Cybersecurity Framework | `sebi.gov.in/legal/circulars/dec-2023/cybersecurity-and-cyber-resilience-framework-cscrf-for-sebi-regulated-entities_80217.html` |
| sebi-002 | Cyber Security Framework for Stock Exchanges, CCs, Depositories | 2015-07-06 | Cybersecurity Framework | `sebi.gov.in/legal/circulars/jul-2015/cyber-security-and-cyber-resilience-framework-of-stock-exchanges-clearing-corporations-and-depositories_30290.html` |
| sebi-003 | Strengthening Cyber Framework for Stockbrokers/DPs | 2018-12-03 | Cybersecurity Framework | `sebi.gov.in/legal/circulars/dec-2018/cyber-security-and-cyber-resilience-framework-for-stock-brokers-depository-participants_41215.html` |
| sebi-004 | Framework for Cloud Services by SREs | 2023-12-20 | Cloud Security | `sebi.gov.in/legal/circulars/dec-2023/framework-for-adoption-of-cloud-services-by-sebi-regulated-entities_80222.html` |
| sebi-005 | System Audit Framework for Stock Exchanges & Depositories | 2019-01-10 | System Audit | `sebi.gov.in/legal/circulars/jan-2019/comprehensive-guidelines-on-system-audit-of-stock-exchanges-and-depositories_41633.html` |
| sebi-006 | Technology Risk Management Framework for MFs/AMCs | 2023-05-04 | IT Governance | `sebi.gov.in/legal/circulars/may-2023/technology-risk-management-framework-for-mutual-funds-asset-management-companies_71019.html` |
| sebi-007 | CSCRF for Portfolio Managers | 2024-04-04 | Cybersecurity Framework | `sebi.gov.in/legal/circulars/apr-2024/cybersecurity-and-cyber-resilience-framework-cscrf-for-portfolio-managers_82752.html` |
| sebi-008 | BCP and DR for Stock Exchanges & Depositories | 2012-09-13 | Business Continuity | `sebi.gov.in/legal/circulars/sep-2012/business-continuity-plan-bcp-and-disaster-recovery-dr-_23668.html` |

### IRDAI (6 entries — ALL POINT TO GENERIC PAGE)

| ID | Name | Date | Category |
|----|------|------|----------|
| irdai-001 | Guidelines on Information and Cyber Security for Insurers | 2017-04-07 | Cybersecurity Framework |
| irdai-002 | Master Circular on Information and Cyber Security | 2023-11-15 | Cybersecurity Framework |
| irdai-003 | Guidelines on Outsourcing of Activities by Indian Insurers | 2011-07-01 | IT Outsourcing |
| irdai-004 | Guidelines on Cloud Computing for Insurance Sector | 2023-10-20 | Cloud Security |
| irdai-005 | Corporate Governance Guidelines for Insurers | 2016-05-18 | IT Governance |
| irdai-006 | Cyber Incident Reporting Requirements for Insurance Companies | 2023-02-10 | Incident Reporting |

**All IRDAI entries have `url` and `pdfUrl` = `https://www.irdai.gov.in/circulars` (generic listing page)**

### UIDAI (7 entries — ALL POINT TO GENERIC PAGES)

| ID | Name | Date | Category |
|----|------|------|----------|
| uidai-001 | Aadhaar Data Vault Guidelines | 2018-07-10 | Data Protection |
| uidai-002 | Virtual ID (VID) Implementation Guidelines | 2018-01-10 | Data Protection |
| uidai-003 | Security Requirements for AUA and KUA | 2017-08-15 | Cybersecurity Framework |
| uidai-004 | Security Audit Requirements for Aadhaar Auth Ecosystem | 2019-06-20 | Security Assessment |
| uidai-005 | Guidelines on Face Authentication and Iris Authentication | 2018-09-15 | Biometric Security |
| uidai-006 | Aadhaar e-KYC API Security and Compliance Requirements | 2019-11-10 | Data Protection |
| uidai-007 | Information Security Policy for Aadhaar Enrolment Centres | 2018-04-25 | Cybersecurity Framework |

**UIDAI entries point to either `authentication-devices-documents/aadhaar-data-vault.html`, `authentication-devices-documents/virtual-id.html`, or generic `authentication-devices-documents.html`**

---

## 7. SOURCE CODE (Key Files)

### main.js — Circular Card Renderer (the critical part)

The `renderCircularCard()` function generates the View/Read/Download buttons:

```js
// Lines 160-173 of src/main.js
<div class="circular-card__actions">
  <a href="${circular.url}" target="_blank" rel="noopener noreferrer" class="circular-card__action circular-card__action--primary" title="View on official website">
    <span class="circular-card__action-icon">👁️</span>
    View
  </a>
  <a href="${circular.pdfUrl || circular.url}" target="_blank" rel="noopener noreferrer" class="circular-card__action" title="Read the full document">
    <span class="circular-card__action-icon">📖</span>
    Read
  </a>
  <a href="${circular.pdfUrl || circular.url}" target="_blank" rel="noopener noreferrer" class="circular-card__action" title="Download from official source" download>
    <span class="circular-card__action-icon">⬇️</span>
    Download
  </a>
</div>
```

**Problem**: View, Read, and Download all point to the same URL since `url === pdfUrl` for most entries. User requested: Remove "Read" button. "View" should open in new tab. "Download" should directly download the PDF.

### regulator.js — Regulator Info

```js
const REGULATOR_INFO = {
  rbi: {
    name: 'RBI', fullName: 'Reserve Bank of India',
    website: 'https://www.rbi.org.in',
    circularsPage: 'https://www.rbi.org.in/Scripts/BS_ViewNotifications.aspx',
    description: 'India\'s central banking institution...',
  },
  sebi: {
    name: 'SEBI', fullName: 'Securities and Exchange Board of India',
    website: 'https://www.sebi.gov.in',
    circularsPage: 'https://www.sebi.gov.in/legal/circulars.html',
    description: 'Regulator for securities and commodity markets...',
  },
  irdai: {
    name: 'IRDAI', fullName: 'Insurance Regulatory and Development Authority of India',
    website: 'https://www.irdai.gov.in',
    circularsPage: 'https://www.irdai.gov.in/circulars',
    description: 'Regulator for the insurance industry...',
  },
  npci: {
    name: 'NPCI', fullName: 'National Payments Corporation of India',
    website: 'https://www.npci.org.in',
    circularsPage: 'https://www.npci.org.in/what-we-do/circulars',
    description: 'Umbrella organization for retail payment systems...',
  },
  uidai: {
    name: 'UIDAI', fullName: 'Unique Identification Authority of India',
    website: 'https://uidai.gov.in',
    circularsPage: 'https://uidai.gov.in',
    description: 'Statutory authority responsible for Aadhaar...',
  },
};
```

### search.js — Search & Filter Engine

Key functions:
- `searchCirculars(circulars, query)` — relevance-scored multi-field search
- `filterByRegulator(circulars, regulator)` — case-insensitive filter
- `filterByCategory(circulars, category)` — category filter
- `sortCirculars(circulars, sortBy)` — date/name sorting
- `getCategories(circulars)` — unique category list
- `getNewestCirculars(circulars, count)` — top N by date
- `getCountByRegulator(circulars)` — counts per regulator

---

## 8. RESEARCH FINDINGS — REGULATOR WEBSITES

### SEBI (sebi.gov.in)

- **Tech stack**: Legacy Java/Struts MVC framework (`HomeAction.do` controller pattern)
- **No public API** — returns HTML pages only
- **Circulars listing**: `https://www.sebi.gov.in/legal/circulars.html`
- **Master Circulars**: `https://www.sebi.gov.in/legal/master-circulars.html`
- **Legacy endpoint**: `https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=1&smid=0`
- **Individual circular URL pattern**: `https://www.sebi.gov.in/legal/circulars/{month-abbr}-{year}/{slug}_{id}.html` (dynamically generated, not predictable)
- **Circular reference format**: `SEBI/HO/{Dept}/{Division}/P/CIR/{Year}/{SeqNum}`
- **No RSS feed** — email subscription only
- **Departments**: IMD (mutual funds), MIRSD (brokers), CFD (listed companies), DDHS (debt), MRD (exchanges/depositories), LAD (legal)
- **Open-source scrapers exist**: `rhnvrm/stock-market-circulars` (GitHub Actions, 3hr cycle), `ArchishmanSengupta/frc` (SEBI+RBI scraper)

### IRDAI (irdai.gov.in)

- **Tech stack**: Liferay CMS (Java-based content management)
- **No public API** — Liferay headless API exists but is locked down
- **Circulars page**: `https://irdai.gov.in/circulars`
- **Individual document pattern**: `https://irdai.gov.in/document-detail?documentId={ID}` (Liferay CMS IDs)
- **JavaScript-heavy** — may need Playwright/Selenium, not just requests+BeautifulSoup
- **Filters by**: Department (Life, Non-Life, Health, IT, etc.), Entity Type, Classification/Topic
- **Third-party aggregators**: TaxGuru (taxguru.in), CAalley (caalley.com), Taxmann (taxmann.com)
- **Notable recent circulars**: Cyber Crisis Preparedness (Mar 2025), Master Circular Corporate Governance (May 2024), Master Circular Operations (Jun 2024)

### UIDAI (uidai.gov.in)

- **Tech stack**: Joomla CMS (PHP-based), one of the busiest Joomla sites globally, 13 language support
- **No public API** for circulars — only authentication APIs at `developer.uidai.gov.in` (restricted)
- **Circulars page**: `https://uidai.gov.in/en/about-uidai/legal-framework/circulars.html`
- **Alternate URL**: `https://uidai.gov.in/en/about-uidai/legal-framework/circulars-memorandums-and-notification.html`
- **Pagination**: AJAX/form-based (NOT URL query params) — needs Selenium/Playwright
- **Categories**: Enrolment & Update, Authentication & Offline Verification, Aadhaar Usage & Governance, Data Security & Compliance, Administrative & Financial, Reactivation/Deactivation
- **Archive section** exists for older documents

---

## 9. OUTSTANDING TASKS (What Needs To Be Done)

### Priority 1: Fix Broken Circular URLs (CRITICAL)

For **SEBI**, **IRDAI**, and **UIDAI**, all circular URLs need to be:
1. **Verified** against the actual regulator websites (web search + manual verification)
2. **Replaced** with working URLs that point to the specific circular, not generic listing pages
3. **Differentiated**: `url` should point to the HTML circular page; `pdfUrl` should point to the direct PDF download

### Priority 2: Expand Circular Database

The current 21 non-RBI circulars are far too few. Target:
- **SEBI**: 8 → 20+ circulars (add CSCRF amendments, LODR, algo trading, KYC/AML tech, incident reporting, etc.)
- **IRDAI**: 6 → 15+ circulars (add master circulars on governance/ops, cyber crisis 2025, AML/KYC, BCP/DR, DPDPA, etc.)
- **UIDAI**: 7 → 15+ circulars (add Auth API 2.5, HSM requirements, offline verification, tokenization, masked Aadhaar, etc.)

### Priority 3: Fix Frontend Button Behavior

In `src/main.js` `renderCircularCard()`:
- **Remove** the "Read" button entirely
- **"View"** button: opens `circular.url` in new tab (current behavior — just fix the URLs)
- **"Download"** button: triggers direct PDF download using `circular.pdfUrl` with proper `download` attribute

### Priority 4: Future — User-Submitted Links Feature

User wants: if a circular isn't found by automated means, users can submit an external link that gets mapped to the relevant regulator. Requires:
- A submission form / input UI
- Review/approval flag for data integrity
- Schema extension (e.g., `"source": "community"` field)
- **Not yet started — park this for later**

### Priority 5: Future — Additional Regulators

The user mentioned wanting to add: **CERT-In**, **DPDPA**, **CICRA**, **E-Sign**. However, they explicitly requested to **NOT** integrate more regulators until the current ones are stable. Park this.

---

## 10. USER CONSTRAINTS & PREFERENCES

1. **DO NOT alter existing database schemas, API routes, or core backend state logic** unless explicitly asked
2. **All changes go to `dev` branch first** → test → UAT → production
3. User's background: **Information Security and Cybersecurity** — focus circulars on GRC (Governance, Risk, Compliance), cybersecurity frameworks, IT governance, data protection
4. **Web scraping is acceptable** — user explicitly said "go with the process of web-scraping and go full on for improving the overall back-end logic. Don't restrict yourself"
5. **Don't restrict to official websites** — can use third-party aggregator sites to find/verify circular URLs
6. Static scraping (requests + BeautifulSoup) breaks on client-side rendered sites — user understands this; Playwright/headless browser approach is preferred for SEBI/IRDAI/UIDAI
7. User wants a `progress_log.md` for any changes made

---

## 11. PREVIOUS FAILED ATTEMPT (Context)

A previous attempt was made to update the scrapers/circular data. It failed because:
- **Static fetch/BeautifulSoup approach** couldn't parse JavaScript-rendered government sites
- The update introduced **404 errors and blank pages** across the app
- The user requested a **rollback**, which was completed successfully to commit `7e6e6fc`
- **Lesson learned**: Don't deploy scraping changes without thorough URL verification first

---

## 12. RECOMMENDED APPROACH FOR THE NEW MODEL

1. **Start with SEBI** — search the web for each existing SEBI circular title + document ID to find the real working URL on `sebi.gov.in`. The URL pattern is `https://www.sebi.gov.in/legal/circulars/{month}-{year}/{slug}_{numericId}.html`. Add 12+ new cybersecurity/IT circulars.

2. **Then IRDAI** — the document detail pattern is `https://irdai.gov.in/document-detail?documentId={ID}`. Search for each circular title to find the real documentId. Check TaxGuru and CAalley as alternative sources. Add 10+ new circulars.

3. **Then UIDAI** — circulars are at `https://uidai.gov.in/en/about-uidai/legal-framework/circulars.html`. Search for each specific circular by title and document number. Add 8+ new entries.

4. **Fix the frontend** — remove Read button, differentiate View vs Download in `renderCircularCard()` in `main.js`.

5. **Build a URL verification script** — `scripts/verify-urls.js` that checks all URLs in `circulars.json` return 200.

6. **Commit to dev** → verify on Vercel dev deployment → merge to uat → merge to main.

---

## 13. FILE CONTENTS REFERENCE

The complete contents of all source files are available in the repository. Key files to read first:
- `src/data/circulars.json` — the database (581 lines, 36KB)
- `src/main.js` — router + card renderer (255 lines)
- `src/pages/regulator.js` — regulator detail page (192 lines)
- `src/pages/dashboard.js` — dashboard page (6.5KB)
- `src/pages/search.js` — search page (6KB)
- `src/utils/search.js` — search/filter logic (4.8KB)
- `src/utils/storage.js` — localStorage utils (3.6KB)
- `src/styles/index.css` — design system (29.6KB)
- `index.html` — entry HTML (3.9KB)
