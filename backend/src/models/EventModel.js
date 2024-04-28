const mongoose = require('mongoose');

// specifies schema for an event 
const eventSchema = new mongoose.Schema({
    title: { // optional name to categorize events
        type: String,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    }
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;