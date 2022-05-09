const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema(
    {
        content: {
            type: String,
            default: "undefined"
        }
    },
    {
        timestamps: false
    }
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
