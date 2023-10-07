const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FormerDirectorSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    DirectorName: {
      type: String,
    },
    DirectorPhoto: {
      type: String,
    },
    Descrption: {
      type: String,
    },
    Duration: {
      type: {
        from: {
          type: String,
        },
        to: {
          type: String,
        },
      },
      _id: false,
    },
  },
  {
    collection: "FormerDirectors",
  }
);

module.exports = mongoose.model("FormerDirectors", FormerDirectorSchema);
