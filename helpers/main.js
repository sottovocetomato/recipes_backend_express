function getOffset(currentPage = 1, listPerPage) {
  return (currentPage - 1) * [listPerPage];
}

function getPaginationMeta({ limit = 20, page = 0, count = 0 } = {}) {
  const _meta = {
    perPage: limit,
    totalCount: count,
    currentPage: page,
    pages: Math.ceil(count / limit),
  };
  return _meta;
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

module.exports = {
  getOffset,
  emptyOrRows,
  getPaginationMeta,
};
