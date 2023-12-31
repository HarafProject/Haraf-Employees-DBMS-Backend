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

const beneficiarySchema = new mongoose.Schema({

    FIRSTNAME: {
        type: String,
        required: true,
    },
    LASTNAME: {
        type: String,
        required: true,
    },
    bankName: { type: String },
    BANK_CODE: { type: String },
    ACC_NUM: { type: String },
    BVN: { type: String },
    // state: {
    //     type: mongoose.Schema.Types.ObjectId, required: true, default: "630500e1c9ae75a1ce111f15"
    // },
    // zone: {
    //     type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone'
    // },
    // lga: {
    //     type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA'
    // },
    // ward: {
    //     type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ward'
    // },
    // address: {
    //     type: String,
    //     required: true,
    // },
    // age: {
    //     type: String,
    //     required: true,
    // },
    // workTypology: {
    //     type: mongoose.Schema.Types.ObjectId, required: true, ref: 'WorkTypology'

    // },
    // maritalStatus: {
    //     type: String,

    // },
    // specialDisability: {
    //     type: String,

    // },
    // householdSize: {
    //     type: String,
    // },
    // householdHead: {
    //     type: String,
    // },
    // sex: {
    //     type: String,
    // },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

}, {
    timestamps: true
});
module.exports = mongoose.model('Beneficiary', beneficiarySchema);