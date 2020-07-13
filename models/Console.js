const mongoose = require('mongoose');

const ConsoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, {timestamps: true});

// Create and Export Console Model
module.exports = mongoose.model('Console', ConsoleSchema);