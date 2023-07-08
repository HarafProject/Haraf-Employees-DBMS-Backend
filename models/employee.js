const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true
  },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  bankCode: { type: String, required: true },
  accountNumber: { type: String, required: true },
  state: {
    type: mongoose.Schema.Types.ObjectId, required: true, default: "630500e1c9ae75a1ce111f15"
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone'
  },
  lga: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA'
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ward'
  },
  address: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  workTypology: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'WorkTypology'

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

});
module.exports = mongoose.model('Employee', EmployeeSchema);