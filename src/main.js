/**
 * RegVault — Main Application Entry Point
 * SPA Router, Theme Management, and Shared Utilities
 */

import { inject } from '@vercel/analytics';
import { renderDashboard } from './pages/dashboard.js';
import { renderRegulatorPage } from './pages/regulator.js';
import { renderSearchPage } from './pages/search.js';
import { getSavedTheme, saveTheme } from './utils/storage.js';

// ---- State ----
let circularsData = [];
let currentRoute = '';

// ---- Data Loading ----
async function loadCirculars() {
  try {
    const response = await fetch(new URL('./data/circulars.json', import.meta.url));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    circularsData = await response.json();
    console.log(`RegVault: Loaded ${circularsData.length} circulars`);
  } catch (e) {
    console.error('RegVault: Failed to load circulars data', e);
    circularsData = [];
  }
}

// ---- Theme Management ----
const THEMES = ['light', 'dark', 'system'];

function initTheme() {
  const saved = getSavedTheme();
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  saveTheme(theme);
}

function cycleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'system';
  const index = THEMES.indexOf(current);
  const next = THEMES[(index + 1) % THEMES.length];
  applyTheme(next);
  showToast(`Theme: ${next.charAt(0).toUpperCase() + next.slice(1)}`);
}

// ---- Router ----
function getRoute() {
  const hash = window.location.hash || '#/';
  return hash.replace('#', '');
}

function parseRoute(route) {
  // Remove query string for route matching
  const [path, queryString] = route.split('?');
  const params = new URLSearchParams(queryString || '');

  if (path === '/' || path === '') {
    return { page: 'dashboard', params };
  }

  const regulatorMatch = path.match(/^\/regulator\/(\w+)$/);
  if (regulatorMatch) {
    return { page: 'regulator', id: regulatorMatch[1], params };
  }

  if (path === '/search') {
    return { page: 'search', params };
  }

  return { page: 'dashboard', params };
}

async function navigate() {
  const route = getRoute();
  if (route === currentRoute) return;
  currentRoute = route;

  const { page, id, params } = parseRoute(route);
  const app = document.getElementById('app');

  // Update active nav link
  document.querySelectorAll('.header__nav-link').forEach(link => {
    const linkRoute = link.getAttribute('data-route');
    const isActive = (page === 'dashboard' && linkRoute === '/') ||
                     (page === 'search' && linkRoute === '/search') ||
                     (page === 'regulator' && linkRoute === '/');
    link.classList.toggle('active', isActive);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Add fade animation
  app.style.animation = 'none';
  app.offsetHeight; // Force reflow
  app.style.animation = 'fadeIn var(--transition-slow) ease-out';

  // Render page
  switch (page) {
    case 'dashboard':
      document.title = 'RegVault — Indian Regulatory Circulars Dashboard';
      renderDashboard(app, circularsData);
      break;

    case 'regulator':
      const regName = (id || '').toUpperCase();
      document.title = `${regName} Circulars — RegVault`;
      renderRegulatorPage(app, id, circularsData);
      break;

    case 'search':
      document.title = 'Search Circulars — RegVault';
      const query = params.get('q') || '';
      renderSearchPage(app, circularsData, query);
      break;

    default:
      document.title = 'RegVault — Indian Regulatory Circulars Dashboard';
      renderDashboard(app, circularsData);
  }
}

// ---- Shared: Circular Card Renderer ----
/**
 * Render a circular card HTML string
 * @param {Object} circular 
 * @returns {string} HTML string
 */
export function renderCircularCard(circular) {
  const dateFormatted = formatDate(circular.dateIssued);
  const isNew = isRecentlyIssued(circular.dateIssued, 90); // Within last 90 days
  const tags = (circular.tags || []).slice(0, 4);
  const applicableTo = (circular.applicableTo || []).join(', ');

  return `
    <article class="circular-card" data-circular-id="${circular.id}" id="circular-${circular.id}">
      ${isNew ? '<span class="circular-card__new-badge">NEW</span>' : ''}
      <div class="circular-card__header">
        <h3 class="circular-card__title">${escapeHtml(circular.name)}</h3>
        <span class="circular-card__regulator-tag" data-regulator="${circular.regulator.toLowerCase()}">${circular.regulator}</span>
      </div>
      <div class="circular-card__doc-id" title="Click to copy document ID">
        ${escapeHtml(circular.documentId)}
        <span class="circular-card__doc-id-copy">📋 Copy</span>
      </div>
      <div class="circular-card__meta">
        <span class="circular-card__meta-item">📅 ${dateFormatted}</span>
        ${circular.category ? `<span class="circular-card__meta-item">📁 ${escapeHtml(circular.category)}</span>` : ''}
        ${applicableTo ? `<span class="circular-card__meta-item">🏢 ${escapeHtml(applicableTo)}</span>` : ''}
      </div>
      ${circular.description ? `<p class="circular-card__description">${escapeHtml(circular.description)}</p>` : ''}
      ${tags.length > 0 ? `
        <div class="circular-card__tags">
          ${tags.map(tag => `<span class="circular-card__tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      ` : ''}
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
    </article>
  `;
}

// ---- Shared: Toast Notification ----
let toastTimer = null;

/**
 * Show a toast notification
 * @param {string} message 
 */
export function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 300ms ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ---- Helpers ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function isRecentlyIssued(dateStr, days) {
  if (!dateStr) return false;
  const issued = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return issued >= cutoff;
}

// ---- Initialization ----
async function init() {
  // Initialize Vercel Web Analytics
  inject();

  // Load theme
  initTheme();

  // Theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', cycleTheme);
  }

  // Load data
  await loadCirculars();

  // Initial route
  navigate();

  // Listen for hash changes
  window.addEventListener('hashchange', navigate);
}

// Boot
init();
