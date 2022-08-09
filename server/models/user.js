const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "people-circle-outline.svg",
    },
    followers: [{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}],
});

mongoose.model('User', useSchema);