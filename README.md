# RegVault 🏛️🔒

**Indian Regulatory Circulars Dashboard for Cybersecurity & Information Security**

RegVault is a centralized web application for GRC professionals to discover, search, access, and track cybersecurity and information security circulars from India's key financial regulators:

- 🏦 **RBI** — Reserve Bank of India
- 📈 **SEBI** — Securities and Exchange Board of India
- 🛡️ **IRDAI** — Insurance Regulatory and Development Authority of India
- 💳 **NPCI** — National Payments Corporation of India
- 🆔 **UIDAI** — Unique Identification Authority of India

## Features

- **📊 Dashboard** — Overview with regulator hub, newest circulars, and recently accessed trail
- **🔥 Fresh off the Press** — Latest cybersecurity circulars across all regulators
- **🔍 Smart Search** — Search by circular name, document ID, keywords, or category
- **🏛️ Regulator Pages** — Dedicated pages for each regulator with category filters and sorting
- **📋 Copy Document IDs** — Click any document ID to copy it to clipboard
- **👁️ View / 📖 Read / ⬇️ Download** — Direct links to official regulator websites
- **🕐 Access Tracking** — Automatically tracks recently accessed circulars
- **🌙 Theme Toggle** — Light, Dark, and System (auto) themes
- **📱 Responsive** — Works on desktop, tablet, and mobile
- **🔒 Privacy** — All data stored locally in your browser (localStorage)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | [Vite](https://vitejs.dev/) |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Vanilla CSS with CSS Custom Properties |
| Data | Curated JSON database |
| State | localStorage |
| Routing | Hash-based SPA |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (included with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/regvault.git
cd regvault

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will open at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/)
3. Vercel auto-detects Vite and deploys

Or via CLI:
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages

```bash
npm run build
# Push the dist/ folder to gh-pages branch
```

### Netlify

1. Push to GitHub
2. Import on [Netlify](https://netlify.com/)
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## Project Structure

```
regvault/
├── index.html                    # Main HTML shell
├── package.json                  # Project config
├── vite.config.js                # Vite configuration
├── public/
│   └── favicon.svg               # App favicon
├── src/
│   ├── main.js                   # App entry, router, shared utilities
│   ├── data/
│   │   └── circulars.json        # Curated circulars database
│   ├── styles/
│   │   └── index.css             # Complete design system
│   ├── pages/
│   │   ├── dashboard.js          # Dashboard page
│   │   ├── regulator.js          # Regulator detail page
│   │   └── search.js             # Search page
│   └── utils/
│       ├── storage.js            # localStorage utilities
│       └── search.js             # Search & filter engine
```

## Data Sources

All circulars link directly to official regulator websites. RegVault does not host or modify any regulatory documents.

| Regulator | Official Circulars Page |
|-----------|------------------------|
| RBI | [rbi.org.in/Scripts/BS_ViewNotifications.aspx](https://www.rbi.org.in/Scripts/BS_ViewNotifications.aspx) |
| SEBI | [sebi.gov.in/legal/circulars.html](https://www.sebi.gov.in/legal/circulars.html) |
| IRDAI | [irdai.gov.in/circulars](https://www.irdai.gov.in/circulars) |
| NPCI | [npci.org.in/what-we-do/circulars](https://www.npci.org.in/what-we-do/circulars) |
| UIDAI | [uidai.gov.in](https://uidai.gov.in) |

## License

MIT

---

**Developed by Rishab Hudlikar** (Risk Advisory Consultant)
