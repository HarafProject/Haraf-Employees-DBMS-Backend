const { default: mongoose } = require("mongoose");

const workTypologySchema = mongoose.Schema({

    name: { type: String, required: true }
});

module.exports = mongoose.model('WorkTypology', workTypologySchema);