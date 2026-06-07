/**
 * RegVault — Search & Filter Engine
 * Full-text search across circular names, document IDs, descriptions, and tags
 */

/**
 * Normalize text for search comparison
 * @param {string} text 
 * @returns {string}
 */
function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.\-\/\\:,;()]/g, ' ')  // Replace separators with spaces
    .replace(/\s+/g, ' ')              // Collapse whitespace
    .trim();
}

/**
 * Search circulars with a query string
 * @param {Array} circulars - Full array of circulars
 * @param {string} query - Search query
 * @returns {Array} Matching circulars with relevance scores
 */
export function searchCirculars(circulars, query) {
  if (!query || query.trim().length === 0) return circulars;

  const normalizedQuery = normalize(query);
  const queryTerms = normalizedQuery.split(' ').filter(t => t.length > 0);

  const results = circulars
    .map(circular => {
      let score = 0;
      const searchableFields = {
        name: normalize(circular.name),
        documentId: normalize(circular.documentId),
        description: normalize(circular.description || ''),
        category: normalize(circular.category || ''),
        tags: (circular.tags || []).map(t => normalize(t)).join(' '),
        applicableTo: (circular.applicableTo || []).map(a => normalize(a)).join(' '),
        regulator: normalize(circular.regulator),
        regulatorFullName: normalize(circular.regulatorFullName || ''),
      };

      // Exact document ID match (highest priority)
      if (searchableFields.documentId.includes(normalizedQuery)) {
        score += 100;
      }

      // Exact name match
      if (searchableFields.name.includes(normalizedQuery)) {
        score += 50;
      }

      // Per-term matching
      for (const term of queryTerms) {
        if (searchableFields.documentId.includes(term)) score += 20;
        if (searchableFields.name.includes(term)) score += 15;
        if (searchableFields.category.includes(term)) score += 10;
        if (searchableFields.regulator.includes(term)) score += 10;
        if (searchableFields.regulatorFullName.includes(term)) score += 8;
        if (searchableFields.tags.includes(term)) score += 8;
        if (searchableFields.description.includes(term)) score += 5;
        if (searchableFields.applicableTo.includes(term)) score += 5;
      }

      return { circular, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.circular);

  return results;
}

/**
 * Filter circulars by regulator
 * @param {Array} circulars 
 * @param {string|null} regulator - Regulator code (e.g., 'RBI') or null for all
 * @returns {Array}
 */
export function filterByRegulator(circulars, regulator) {
  if (!regulator || regulator === 'all') return circulars;
  return circulars.filter(c => c.regulator.toLowerCase() === regulator.toLowerCase());
}

/**
 * Filter circulars by category
 * @param {Array} circulars 
 * @param {string|null} category - Category string or null for all
 * @returns {Array}
 */
export function filterByCategory(circulars, category) {
  if (!category || category === 'all') return circulars;
  return circulars.filter(c => c.category.toLowerCase() === category.toLowerCase());
}

/**
 * Sort circulars
 * @param {Array} circulars 
 * @param {'date-desc'|'date-asc'|'name-asc'|'name-desc'} sortBy 
 * @returns {Array}
 */
export function sortCirculars(circulars, sortBy = 'date-desc') {
  const sorted = [...circulars];
  switch (sortBy) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.dateIssued) - new Date(a.dateIssued));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.dateIssued) - new Date(b.dateIssued));
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

/**
 * Get unique categories from circulars
 * @param {Array} circulars 
 * @returns {string[]}
 */
export function getCategories(circulars) {
  const categories = new Set(circulars.map(c => c.category).filter(Boolean));
  return [...categories].sort();
}

/**
 * Get the newest circulars (by date issued)
 * @param {Array} circulars 
 * @param {number} count 
 * @returns {Array}
 */
export function getNewestCirculars(circulars, count = 6) {
  return sortCirculars(circulars, 'date-desc').slice(0, count);
}

/**
 * Get circular count per regulator
 * @param {Array} circulars 
 * @returns {Object} e.g., { RBI: 12, SEBI: 8, ... }
 */
export function getCountByRegulator(circulars) {
  const counts = {};
  for (const c of circulars) {
    counts[c.regulator] = (counts[c.regulator] || 0) + 1;
  }
  return counts;
}
