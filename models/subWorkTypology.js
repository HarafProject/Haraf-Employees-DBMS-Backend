const mongoose = require("mongoose");
const { SoftDelete } = require("soft-delete-mongoose-plugin");

// defind soft delete field name
const IS_DELETED_FIELD = "isDeleted";
const DELETED_AT_FIELD = "deletedAt";

// use soft delete plugin
mongoose.plugin(new SoftDelete({
    isDeletedField: IS_DELETED_FIELD,
    deletedAtField: DELETED_AT_FIELD,
}).getPlugin());

const subWorkTypologySchema = mongoose.Schema({

    sector: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'WorkTypology' },
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
});

module.exports = mongoose.model('SubWorkTypology', subWorkTypologySchema);