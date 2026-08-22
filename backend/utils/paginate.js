/**
 * Utility functions for pagination handling across models and controllers.
 */

function parsePagination(query = {}, options = {}) {
  const { defaultPage = 1, defaultLimit = 10, maxLimit = 50 } = options;

  const rawPage = query.page !== undefined ? query.page : defaultPage;
  const rawLimit = query.limit !== undefined ? query.limit : defaultLimit;

  const page = Number(rawPage);
  const limit = Number(rawLimit);

  if (!Number.isInteger(page) || page < 1) {
    return {
      isValid: false,
      error: 'Le paramètre "page" doit être un entier supérieur ou égal à 1.',
    };
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    return {
      isValid: false,
      error: `Le paramètre "limit" doit être un entier compris entre 1 et ${maxLimit}.`,
    };
  }

  const offset = (page - 1) * limit;

  return {
    isValid: true,
    page,
    limit,
    offset,
  };
}

function formatPaginationResponse({ data = [], totalItems = 0, page = 1, limit = 10 }) {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    },
  };
}

module.exports = {
  parsePagination,
  formatPaginationResponse,
};
