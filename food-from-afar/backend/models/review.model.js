const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        creator: {
            type: String
        },
        name: {
            type: String,
            default: "undefined"
        },
        recipe: {
            type: String
        },
        rating: {
            type: Number,
            min: [1, "Invalid Rating"],
            max: [5, "Invalid Rating"],
            default: 1
        },
        content: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
