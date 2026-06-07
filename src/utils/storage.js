/**
 * RegVault — localStorage Utilities
 * Tracks recently accessed circulars and user preferences
 */

const STORAGE_KEYS = {
  RECENT: 'regvault_recent_accessed',
  THEME: 'regvault_theme',
  SEARCH_HISTORY: 'regvault_search_history',
};

const MAX_RECENT = 20;
const MAX_SEARCH_HISTORY = 10;

/**
 * Track a circular access event
 * @param {Object} circular - The circular object that was accessed
 */
export function trackAccess(circular) {
  const recent = getRecentlyAccessed();
  
  // Remove existing entry for this circular if present
  const filtered = recent.filter(item => item.id !== circular.id);
  
  // Add new entry at the beginning
  filtered.unshift({
    id: circular.id,
    name: circular.name,
    documentId: circular.documentId,
    regulator: circular.regulator,
    timestamp: Date.now(),
    accessCount: (getAccessCount(circular.id) || 0) + 1,
  });
  
  // Cap at MAX_RECENT
  const trimmed = filtered.slice(0, MAX_RECENT);
  
  try {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('RegVault: Could not save to localStorage', e);
  }
}

/**
 * Get recently accessed circulars
 * @returns {Array} Array of recently accessed circular entries
 */
export function getRecentlyAccessed() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Get access count for a specific circular
 * @param {string} circularId 
 * @returns {number}
 */
export function getAccessCount(circularId) {
  const recent = getRecentlyAccessed();
  const entry = recent.find(item => item.id === circularId);
  return entry ? entry.accessCount : 0;
}

/**
 * Save theme preference
 * @param {'light'|'dark'|'system'} theme 
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (e) {
    console.warn('RegVault: Could not save theme preference', e);
  }
}

/**
 * Get saved theme preference
 * @returns {'light'|'dark'|'system'}
 */
export function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'system';
  } catch (e) {
    return 'system';
  }
}

/**
 * Add a search query to history
 * @param {string} query 
 */
export function addSearchHistory(query) {
  if (!query || query.trim().length < 2) return;
  
  const history = getSearchHistory();
  const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
  filtered.unshift(query.trim());
  
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(filtered.slice(0, MAX_SEARCH_HISTORY)));
  } catch (e) {
    console.warn('RegVault: Could not save search history', e);
  }
}

/**
 * Get search history
 * @returns {string[]}
 */
export function getSearchHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Format a relative time string (e.g., "2 hours ago")
 * @param {number} timestamp 
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
