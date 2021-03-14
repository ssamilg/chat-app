const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  content:{
    type: String,
    required: true,
  },
  messageFrom: {
    type: String,
    required: true,
  },
  messageTo: {
    type: String,
    required: true,
  },
  dateSend: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('message', MessageSchema);