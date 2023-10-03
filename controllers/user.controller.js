const db = require("../config/db.config.js");
const User = db.users;

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.scope("withoutPass").findByPk(id, {});
        if (!user) {
            throw new Error(`user with given id: ${req.body.id} cannot be found!`);
        }
        await user.update(req?.body?.data);
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
