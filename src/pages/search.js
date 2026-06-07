/**
 * RegVault — Search Page
 * Full-page search with real-time results, regulator filters, and highlighted matches
 */

import { trackAccess, addSearchHistory } from '../utils/storage.js';
import { searchCirculars, filterByRegulator, sortCirculars } from '../utils/search.js';
import { renderCircularCard, showToast } from '../main.js';

const REGULATORS = ['All', 'RBI', 'SEBI', 'IRDAI', 'NPCI', 'UIDAI'];

/**
 * Render the search page
 * @param {HTMLElement} container 
 * @param {Array} allCirculars 
 * @param {string} [initialQuery] - Pre-fill search from URL param
 */
export function renderSearchPage(container, allCirculars, initialQuery = '') {
  container.innerHTML = `
    <!-- Search Header -->
    <div class="search-page__header">
      <h1 class="search-page__title">Search Circulars</h1>
      <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-lg);">
        Search by name, document ID, keyword, or category across all regulators
      </p>
      <div class="search-box" id="search-box">
        <span class="search-box__icon">🔍</span>
        <input 
          type="text" 
          class="search-box__input" 
          id="search-input"
          placeholder="e.g., DPSS.CO, cyber security framework, tokenization..."
          value="${escapeAttr(initialQuery)}"
          autocomplete="off"
          autofocus
        />
        <button class="search-box__clear ${initialQuery ? 'visible' : ''}" id="search-clear">✕ Clear</button>
      </div>
      <div class="search-filters" id="search-filters">
        ${REGULATORS.map(r => `
          <button class="filter-btn ${r === 'All' ? 'active' : ''}" data-regulator="${r.toLowerCase()}">${r}</button>
        `).join('')}
      </div>
    </div>

    <!-- Results -->
    <div id="search-results-count" class="search-results__count"></div>
    <div class="circular-grid" id="search-results"></div>
  `;

  // State
  let currentRegulator = 'all';
  let debounceTimer = null;

  const input = container.querySelector('#search-input');
  const clearBtn = container.querySelector('#search-clear');
  const resultsContainer = container.querySelector('#search-results');
  const resultsCount = container.querySelector('#search-results-count');

  // Initial search if query provided
  if (initialQuery) {
    performSearch(initialQuery);
  } else {
    // Show all circulars by default
    displayResults(sortCirculars(allCirculars, 'date-desc'), '');
  }

  // Search input handler with debounce
  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearBtn.classList.toggle('visible', query.length > 0);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 200);
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visible');
    performSearch('');
    input.focus();
  });

  // Enter key to save to search history
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      if (query.length >= 2) {
        addSearchHistory(query);
      }
    }
  });

  // Regulator filter buttons
  container.querySelectorAll('#search-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('#search-filters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRegulator = btn.dataset.regulator;
      performSearch(input.value.trim());
    });
  });

  function performSearch(query) {
    let results = allCirculars;

    // Apply search
    if (query.length > 0) {
      results = searchCirculars(results, query);
    }

    // Apply regulator filter
    results = filterByRegulator(results, currentRegulator);

    // Sort: if searching, keep relevance order; otherwise date
    if (query.length === 0) {
      results = sortCirculars(results, 'date-desc');
    }

    displayResults(results, query);
  }

  function displayResults(results, query) {
    if (results.length === 0) {
      resultsCount.textContent = '';
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <div class="empty-state__title">No circulars found</div>
          <div class="empty-state__text">
            ${query ? `No results for "${escapeHtml(query)}". Try different keywords or check the document ID format.` : 'No circulars match the current filters.'}
          </div>
        </div>
      `;
      return;
    }

    resultsCount.innerHTML = query
      ? `Found <strong>${results.length}</strong> circular${results.length !== 1 ? 's' : ''} matching "<span class="search-results__highlight">${escapeHtml(query)}</span>"`
      : `Showing all <strong>${results.length}</strong> circulars`;

    resultsContainer.innerHTML = results.map(c => renderCircularCard(c)).join('');

    // Attach event listeners
    resultsContainer.querySelectorAll('.circular-card__action').forEach(btn => {
      btn.addEventListener('click', () => {
        const circularId = btn.closest('.circular-card')?.dataset.circularId;
        if (circularId) {
          const circular = allCirculars.find(c => c.id === circularId);
          if (circular) trackAccess(circular);
        }
      });
    });

    resultsContainer.querySelectorAll('.circular-card__doc-id').forEach(el => {
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
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
