const { appUrl } = require("./appUrl");

// function getOffset(currentPage = 1, listPerPage) {
//   return (currentPage - 1) * [listPerPage];
// }

function getOffset(limit, page = 1) {
  return parseInt(limit) * (parseInt(page) - 1);
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

function setOrder(order) {
  console.log(Object.keys(order).map((key) => [key, order[key]]));
  return Object.keys(order).map((key) => [key, order[key]]);
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

function mergeObjects(mainObj, mergeObj) {
  Object.keys(mergeObj).forEach((key) => {
    console.log(key, "KEY");
    if (!mainObj.hasOwnProperty(key)) return;
    if (isJsonString(mainObj[key])) mainObj[key] = JSON.parse(mainObj[key]);
    const isObj = typeof mainObj[key] === "object";
    const hasNested = Object.values(mainObj[key]).some(
      (el) => typeof el === "object"
    );

    if (isObj && hasNested) {
      mergeObjects(mainObj[key], mergeObj[key]);
    } else if (isObj && !hasNested) {
      mainObj[key] = Array.isArray(mainObj[key])
        ? mergeObj[key]
        : { ...mainObj[key], ...mergeObj[key] };
    } else {
      mainObj[key] = mergeObj[key];
    }
    console.log(mainObj[key], "ainObj[key]");
  });
}
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
module.exports = {
  getOffset,
  emptyOrRows,
  getPaginationMeta,
  setObjProperty,
  mergeObjects,
  setOrder,
};
