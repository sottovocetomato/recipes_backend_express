const { Op } = require("sequelize");

exports.parseFilter = (filter, noRule = false) => {
  const where = {};
  for (const key in filter) {
    const index = filter[key].indexOf("(");
    if (!index) throw new Error("Wrong filter format");

    const rule = filter[key].slice(0, index);
    let val = filter[key].slice(index + 1, filter[key].indexOf(")"));
    // if (!val) break;
    if (rule === "LIKE") val = `%${val}%`;
    if (rule === "EQ") val = `${val}`;
    if (rule === "BETWEEN") {
      const valArr = val.split(",");
      val = [valArr[0].trim(), valArr[1].trim()];
    }

    if (noRule) {
      where[key] = val;
    } else {
      where[key] = { [Op[rule.toLowerCase()]]: val };
      console.log(where[key], "RECIPE FILTER");
    }
  }
  return where;
};
