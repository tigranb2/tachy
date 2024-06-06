const mongoose = require('mongoose');

// specifies schema for user data
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
});

const EventModel = mongoose.model('User', userSchema);
module.exports = EventModel;