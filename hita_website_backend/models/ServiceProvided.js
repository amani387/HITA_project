const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
    overView: {
      type: String,
    },
    detail: {
      type: String,
    },
  },
  {
    collection: "Services",
  }
);

module.exports = mongoose.model("Services", ServiceSchema);
