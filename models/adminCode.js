const { default: mongoose } = require("mongoose");

const adminCodeSchema = mongoose.Schema({
    code: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10,
    },
});
module.exports = mongoose.model('AdminCode', adminCodeSchema);