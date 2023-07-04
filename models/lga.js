const { default: mongoose } = require("mongoose");

const lgaSchema = mongoose.Schema({

    state: {type: mongoose.Schema.Types.ObjectId, required: true },
    zone: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone'},
    name: {type: String, required: true} 
});


module.exports = mongoose.model('LGA', lgaSchema);