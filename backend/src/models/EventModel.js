const mongoose = require('mongoose');

// specifies schema for an event 
const expiryTime =  60 * 60 * 24 * 60;
const eventSchema = new mongoose.Schema({
    title: { // optional name to categorize events
        type: String,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: { // auto-expires after 60 days
        type: Date,
        required: true,
        expires: expiryTime,
    },
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;