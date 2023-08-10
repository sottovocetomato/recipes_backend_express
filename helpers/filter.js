const { Op } = require("sequelize");

exports.parseFilter = (filter) => {
  const where = {};
  for (const key in filter) {
    const index = filter[key].indexOf("(");
    if (!index) throw new Error("Wrong filter format");
    const rule = filter[key].slice(0, index);
    const val = filter[key].slice(index + 1, filter[key].indexOf(")"));
    where[key] = { [Op[rule.toLowerCase()]]: `%${val}` };
  }
  return where;
};
