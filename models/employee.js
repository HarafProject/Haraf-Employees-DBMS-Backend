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

const EmployeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false
  },
  community:{ type: String, required: false },
  bankName: { type: String, required: false },
  bankCode: { type: String, required: false },
  accountNumber: { type: String, required: false },
  BVN: { type: String, required: false },
  state: {
    type: mongoose.Schema.Types.ObjectId, required: false, default: "630500e1c9ae75a1ce111f15"
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Zone'
  },
  lga: {
    type: mongoose.Schema.Types.ObjectId, required: false, ref: 'LGA'
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Ward'
  },
  address: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
  workTypology: {
    type: mongoose.Schema.Types.ObjectId, required: false, ref: 'WorkTypology'

  },
  maritalStatus: {
    type: String,

  },
  specialDisability: {
    type: String,

  },
  householdSize: {
    type: String,
  },
  qualification: {
    type: String,
  },
  householdHead: {
    type: String,
  },
  sex: {
    type: String,
  },
  photo: {
    type: String,
    default: "https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
  },
  supervisorAction: { type: String, required: false, enum: ["edit", "delete"] },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null },

}, {
  timestamps: true
});
module.exports = mongoose.model('Employee', EmployeeSchema);