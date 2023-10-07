const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auth = new Schema(
  {
    Posting: {
      type: Boolean,
    },
    Editing: {
      type: Boolean,
    },
    Deleting: {
      type: Boolean,
    },
  },
  {
    _id: false,
  }
);

const AdminSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    pwd: {
      type: String,
    },
    role: {
      type: String,
    },
    // authority: {
    //   type: auth,
    // },
  },
  {
    collection: "Admin",
  }
);

module.exports = mongoose.model("Admin", AdminSchema);
