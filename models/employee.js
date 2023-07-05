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
    accountNumber: {
        type: String,
        required: true
    },
   bankName: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
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
        type: String,
       
      },
    maritalStatus: {
        type: String,
       
    },
    specialAbility: {
        type: String,
       
    },
    householdSize: {
        type: String,
      },
    householdHead: {
        type: String,
    },
    gender: {
        type: String,
      },
    photo: {
        type: String,
        default: "https://res.cloudinary.com/jossyjoe/image/upload/v1606258324/UserIcon_tmu1v6.jpg"
    },

});
module.exports = mongoose.model('Employee', EmployeeSchema);