const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    name: {
        type: String,
        required: true,
    },
    color: { 
        type: String,
        required: true,
    },
});

const TagModel = mongoose.model('Tag', tagSchema);
module.exports = TagModel;