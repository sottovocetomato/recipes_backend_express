const { Op } = require("sequelize");

export default function parseFilter(filter) {
    const where = {}
    for (const key in filter) {
        where[key] = [Op[filter[key]]]:
    }
}
