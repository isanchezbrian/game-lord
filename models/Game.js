const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    console: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Console',
    }],
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
}, {timestamps: true});

// Create and Export Game Model
module.exports = mongoose.model('Game', GameSchema);