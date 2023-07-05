const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");

exports.work_typology = async (req, res) => {
    const { name } = req.body;

    await WorkTypology.findOneAndUpdate({ name }, {
        $set: {
            name
        }
    }, {
        upsert: true
    })

    return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Work Typolgy Updated succesfully.",

    });
};
