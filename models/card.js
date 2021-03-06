const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Methodology = require('./methodology');
const User = require('./user');

const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: false,
    },
    value: {
        type: Number,
        required: false,
    },
    comment: [{
        content: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }],
    worker: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    }],
    label: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Methodology.label',
        unique: true,
    }]
});

cardSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Card', cardSchema);