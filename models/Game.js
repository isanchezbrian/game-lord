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
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    console: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Console',
    }],
}, { timestamps: true });

// Create and Export Game Model
module.exports = mongoose.model('Game', GameSchema);