const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const ChatSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sendmessuser: {
        type: ObjectId,
        ref: "User"
    }
},{
    timestamps: true
});

mongoose.model("Chat", ChatSchema);