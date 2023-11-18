const { Schema, model } = require("mongoose");

let ticketSettings = new Schema({
  GuildID: {
    type: String,
    required: true,
  },
  CategoryID: {
    type: String,
    required: true,
  },
  TranscriptsID: {
    type: String,
    required: true,
  },
  ManagerRole: {
    type: String,
    required: true,
  },
});

module.exports = model("ticketSettings8972", ticketSettings);
