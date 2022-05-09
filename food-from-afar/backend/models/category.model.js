const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 1
        },
        alt: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 1
        },
        url: {
            type: String
        }
    },
    {
        timestamps: true,
        sparse: true
    }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
