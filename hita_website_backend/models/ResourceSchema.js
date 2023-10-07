const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({

  _id:mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  detail: {
    type: String,
  },
  file: {
    type: String,
  },
},{
  collection:'Resources'
}
);

module.exports = mongoose.model("Resource", ResourceSchema);
