const { Schema, model } = require("mongoose");

let ticket = new Schema({
  GuildID: {
    type: String,
    required: true,
  },
  UserID: {
    type: String,
    required: true,
  },
  ChannelID: {
    type: String,
    required: true,
  },
  Closed: {
    type: Boolean,
    required: true,
  },
  Timestamp: {
    type: String,
    required: true,
  },
});

module.exports = model("ticket0124", ticket);
