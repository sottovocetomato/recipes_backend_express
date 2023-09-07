const { appUrl } = require("./appUrl");

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

function setObjProperty(obj, path, value) {
  let tempObj = obj;
  let names = path
    .replace(/[\[\]']+/g, ".")
    .split(".")
    .filter((e) => e !== "");
  let len = names.length;
  for (let i = 0; i < len - 1; i++) {
    let el = names[i];
    if (!tempObj[el]) tempObj[el] = {};
    tempObj = tempObj[el];
  }
  tempObj[names[len - 1]] = value;
}

module.exports = {
  getOffset,
  emptyOrRows,
  getPaginationMeta,
  setObjProperty,
};
