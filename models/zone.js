const { default: mongoose } = require("mongoose");

const zoneSchema = mongoose.Schema({

    state: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true}  
});

module.exports = mongoose.model('Zone', zoneSchema);