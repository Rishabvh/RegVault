/**
 * RegVault — Regulator Detail Page
 * Shows all circulars for a specific regulator with filtering and sorting
 */

import { trackAccess } from '../utils/storage.js';
import { filterByCategory, sortCirculars, getCategories, filterByRegulator } from '../utils/search.js';
import { renderCircularCard, showToast } from '../main.js';

const REGULATOR_INFO = {
  rbi: {
    name: 'RBI',
    fullName: 'Reserve Bank of India',
    website: 'https://www.rbi.org.in',
    circularsPage: 'https://www.rbi.org.in/Scripts/BS_ViewNotifications.aspx',
    description: 'India\'s central banking institution that controls monetary policy and regulates banks, NBFCs, and payment system operators.',
  },
  sebi: {
    name: 'SEBI',
    fullName: 'Securities and Exchange Board of India',
    website: 'https://www.sebi.gov.in',
    circularsPage: 'https://www.sebi.gov.in/legal/circulars.html',
    description: 'Regulator for securities and commodity markets in India. Oversees stock exchanges, brokers, and market infrastructure institutions.',
  },
  irdai: {
    name: 'IRDAI',
    fullName: 'Insurance Regulatory and Development Authority of India',
    website: 'https://www.irdai.gov.in',
    circularsPage: 'https://www.irdai.gov.in/circulars',
    description: 'Regulator for the insurance industry in India. Oversees insurance companies, intermediaries, and TPAs.',
  },
  npci: {
    name: 'NPCI',
    fullName: 'National Payments Corporation of India',
    website: 'https://www.npci.org.in',
    circularsPage: 'https://www.npci.org.in/what-we-do/circulars',
    description: 'Umbrella organization for retail payment systems in India including UPI, IMPS, RuPay, AePS, and more.',
  },
  uidai: {
    name: 'UIDAI',
    fullName: 'Unique Identification Authority of India',
    website: 'https://uidai.gov.in',
    circularsPage: 'https://uidai.gov.in',
    description: 'Statutory authority responsible for Aadhaar, India\'s biometric identity system used for authentication and e-KYC.',
  },
};

/**
 * Render the regulator detail page
 * @param {HTMLElement} container 
 * @param {string} regulatorId - e.g., 'rbi', 'sebi'
 * @param {Array} allCirculars - All circulars data
 */
export function renderRegulatorPage(container, regulatorId, allCirculars) {
  const info = REGULATOR_INFO[regulatorId];
  if (!info) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">🚫</div>
        <div class="empty-state__title">Regulator not found</div>
        <div class="empty-state__text">The regulator "${regulatorId}" does not exist. <a href="#/">Return to dashboard</a></div>
      </div>
    `;
    return;
  }

  const regulatorCirculars = filterByRegulator(allCirculars, info.name);
  const categories = getCategories(regulatorCirculars);

  // Determine accent color CSS variable
  const accentVar = `var(--color-${regulatorId})`;
  const softVar = `var(--color-${regulatorId}-soft)`;

  container.innerHTML = `
    <!-- Header -->
    <div class="regulator-page__header">
      <nav class="regulator-page__breadcrumb">
        <a href="#/">Dashboard</a>
        <span>›</span>
        <span>${info.name}</span>
      </nav>
      <div class="regulator-page__title-row">
        <div class="regulator-page__icon" style="background: ${softVar}; color: ${accentVar};">
          ${info.name.substring(0, 2)}
        </div>
        <div>
          <h1 class="regulator-page__title">${info.name}</h1>
          <p class="regulator-page__full-name">${info.fullName}</p>
        </div>
      </div>
      <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: var(--space-sm);">${info.description}</p>
      <a href="${info.circularsPage}" target="_blank" rel="noopener noreferrer" class="regulator-page__website" style="margin-top: var(--space-sm);">
        🌐 Official Circulars Page ↗
      </a>
    </div>

    <!-- Filters -->
    <div class="filters" id="regulator-filters">
      <button class="filter-btn active" data-category="all">All (${regulatorCirculars.length})</button>
      ${categories.map(cat => {
        const count = regulatorCirculars.filter(c => c.category === cat).length;
        return `<button class="filter-btn" data-category="${cat}">${cat} (${count})</button>`;
      }).join('')}
      <select class="sort-select" id="sort-select">
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
      </select>
    </div>

    <!-- Circular List -->
    <div class="circular-grid" id="regulator-circulars">
      ${renderCircularList(regulatorCirculars, 'date-desc')}
    </div>

    ${regulatorCirculars.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state__icon">📭</div>
        <div class="empty-state__title">No circulars found</div>
        <div class="empty-state__text">No cybersecurity circulars are currently catalogued for ${info.name}.</div>
      </div>
    ` : ''}
  `;

  // State
  let currentCategory = 'all';
  let currentSort = 'date-desc';

  // Filter buttons
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      updateCircularList();
    });
  });

  // Sort select
  const sortSelect = container.querySelector('#sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      updateCircularList();
    });
  }

  function updateCircularList() {
    let filtered = filterByCategory(regulatorCirculars, currentCategory);
    filtered = sortCirculars(filtered, currentSort);
    const grid = container.querySelector('#regulator-circulars');
    if (grid) {
      grid.innerHTML = renderCircularList(filtered, currentSort);
      attachListeners();
    }
  }

  function attachListeners() {
    // Track access on action clicks
    container.querySelectorAll('.circular-card__action').forEach(btn => {
      btn.addEventListener('click', () => {
        const circularId = btn.closest('.circular-card')?.dataset.circularId;
        if (circularId) {
          const circular = allCirculars.find(c => c.id === circularId);
          if (circular) trackAccess(circular);
        }
      });
    });

    // Copy document ID
    container.querySelectorAll('.circular-card__doc-id').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = el.textContent.replace('📋 Copy', '').trim();
        navigator.clipboard.writeText(text).then(() => {
          showToast('📋 Document ID copied to clipboard');
        }).catch(() => {
          showToast('📋 Document ID: ' + text);
        });
      });
    });
  }

  attachListeners();
}

function renderCircularList(circulars, sortBy) {
  const sorted = sortCirculars(circulars, sortBy);
  return sorted.map(c => renderCircularCard(c)).join('');
}
