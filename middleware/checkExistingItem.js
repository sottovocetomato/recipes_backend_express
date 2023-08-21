const db = require("../config/db.config");


exports.checkExistingItem = (dbName, field = 'name') => (req, res, next) => {
    const Table = db[dbName];
    Table.findOne({
            where: {
                [field]: req.body[field],
            },
        }).then((entry) => {
            if (entry) {
                res.status(400).send({
                    message: `Запись с именем ${req.body[field]} уже существует`,
                });
                return;
            }

            next();
        });
};

