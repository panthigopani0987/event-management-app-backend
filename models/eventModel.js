const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        reuired: true
    },
    description: {
        type: String,
        reuired: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        reuired: true
    },
    maxAttendees: {
        type: Number,
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    image: {
        type: String
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Event', eventSchema);