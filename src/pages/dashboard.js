/**
 * RegVault — Dashboard Page
 * Main landing page with Hot Releases, Recent Trail, and Regulator Hub
 */

import { getRecentlyAccessed, formatRelativeTime, trackAccess } from '../utils/storage.js';
import { getNewestCirculars, getCountByRegulator } from '../utils/search.js';
import { renderCircularCard, showToast } from '../main.js';

const REGULATORS = [
  { id: 'rbi', name: 'RBI', fullName: 'Reserve Bank of India', website: 'https://www.rbi.org.in' },
  { id: 'sebi', name: 'SEBI', fullName: 'Securities and Exchange Board of India', website: 'https://www.sebi.gov.in' },
  { id: 'irdai', name: 'IRDAI', fullName: 'Insurance Regulatory and Development Authority of India', website: 'https://www.irdai.gov.in' },
  { id: 'npci', name: 'NPCI', fullName: 'National Payments Corporation of India', website: 'https://www.npci.org.in' },
  { id: 'uidai', name: 'UIDAI', fullName: 'Unique Identification Authority of India', website: 'https://uidai.gov.in' },
];

/**
 * Render the dashboard page
 * @param {HTMLElement} container 
 * @param {Array} circulars - All circulars data
 */
export function renderDashboard(container, circulars) {
  const counts = getCountByRegulator(circulars);
  const newest = getNewestCirculars(circulars, 6);
  const recent = getRecentlyAccessed();
  const totalCirculars = circulars.length;
  const totalRegulators = new Set(circulars.map(c => c.regulator)).size;
  const totalCategories = new Set(circulars.map(c => c.category).filter(Boolean)).size;

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="dashboard__hero">
      <h1 class="dashboard__title">
        <span class="dashboard__title-gradient">RegVault</span>
      </h1>
      <p class="dashboard__subtitle">
        Your centralized dashboard for Indian regulatory cybersecurity & information security circulars
      </p>
      <div class="stats-bar">
        <div class="stat-chip">
          <span class="stat-chip__value">${totalCirculars}</span>
          <span class="stat-chip__label">Circulars</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip__value">${totalRegulators}</span>
          <span class="stat-chip__label">Regulators</span>
        </div>
        <div class="stat-chip">
          <span class="stat-chip__value">${totalCategories}</span>
          <span class="stat-chip__label">Categories</span>
        </div>
      </div>
    </section>

    <!-- Regulator Hub -->
    <section class="section" id="regulator-hub">
      <div class="section__header">
        <h2 class="section__title">
          <span class="section__title-icon">🏛️</span>
          Regulator Hub
        </h2>
      </div>
      <div class="regulator-grid" id="regulator-grid">
        ${REGULATORS.map(reg => `
          <a href="#/regulator/${reg.id}" class="regulator-card" data-regulator="${reg.id}" id="reg-card-${reg.id}">
            <div class="regulator-card__icon">${reg.name.charAt(0)}${reg.name.charAt(1)}</div>
            <div class="regulator-card__name">${reg.name}</div>
            <div class="regulator-card__full-name">${reg.fullName}</div>
            <div class="regulator-card__count">
              <span class="regulator-card__count-badge">${counts[reg.name] || 0}</span>
              circulars
            </div>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Hot Releases -->
    <section class="section" id="hot-releases">
      <div class="section__header">
        <h2 class="section__title">
          <span class="section__title-icon">🔥</span>
          Fresh off the Press
        </h2>
        <a href="#/search" class="section__more">View all →</a>
      </div>
      <div class="circular-grid" id="hot-releases-grid">
        ${newest.map(c => renderCircularCard(c)).join('')}
      </div>
    </section>

    <!-- Recent Trail -->
    <section class="section" id="recent-trail">
      <div class="section__header">
        <h2 class="section__title">
          <span class="section__title-icon">🕐</span>
          Your Recent Trail
        </h2>
      </div>
      ${recent.length > 0 ? `
        <div class="recent-trail" id="recent-trail-list">
          ${recent.slice(0, 10).map(item => `
            <a href="#/search?q=${encodeURIComponent(item.documentId)}" class="recent-card" data-circular-id="${item.id}">
              <div class="recent-card__name">${escapeHtml(item.name)}</div>
              <div class="recent-card__doc-id">${escapeHtml(item.documentId)}</div>
              <div class="recent-card__footer">
                <span class="circular-card__regulator-tag" data-regulator="${item.regulator.toLowerCase()}">${item.regulator}</span>
                <span>${formatRelativeTime(item.timestamp)}</span>
              </div>
            </a>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <div class="empty-state__title">No recent activity</div>
          <div class="empty-state__text">Circulars you view, read, or download will appear here for quick access.</div>
        </div>
      `}
    </section>
  `;

  // Attach event listeners for circular card actions
  attachCircularCardListeners(container, circulars);
}

/**
 * Attach event listeners to circular card action buttons
 */
function attachCircularCardListeners(container, circulars) {
  container.querySelectorAll('.circular-card__action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const circularId = btn.closest('.circular-card')?.dataset.circularId;
      if (circularId) {
        const circular = circulars.find(c => c.id === circularId);
        if (circular) {
          trackAccess(circular);
        }
      }
    });
  });

  // Copy document ID on click
  container.querySelectorAll('.circular-card__doc-id').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = el.textContent.replace('📋 Copy', '').trim();
      navigator.clipboard.writeText(text).then(() => {
        showToast('📋 Document ID copied to clipboard');
      }).catch(() => {
        // Fallback for older browsers
        showToast('📋 Document ID: ' + text);
      });
    });
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
