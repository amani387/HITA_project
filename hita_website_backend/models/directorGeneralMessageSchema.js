const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DirectorGeneralsMessage = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    DirectorName: {
      type: String,
    },
    DirectorPhoto: {
      type: String,
    },
    DirectorMessage: {
      type: String,
    },
  },
  {
    collection: "Director_General_Message",
  }
);

module.exports = mongoose.model(
  "DirectorGeneralMessage",
  DirectorGeneralsMessage
);
