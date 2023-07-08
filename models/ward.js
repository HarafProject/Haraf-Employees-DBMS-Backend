const { default: mongoose } = require("mongoose");

const wardSchema = mongoose.Schema({
    lga: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA' },
    name: { type: String, required: true }
});


module.exports = mongoose.model('Ward', wardSchema);