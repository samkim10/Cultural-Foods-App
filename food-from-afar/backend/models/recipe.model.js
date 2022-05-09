const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
    {
        // _id: {
        //   type: Number,
        //   required: true,
        //   unique: true,
        // },
        name: {
            type: String,
            required: [true, "Recipe must include title"],
            unique: false,
            trim: true,
            minlength: 1
        },
        creator: {
            type: String
        },
        category: {
            type: String,
            default: "undefined"
        },
        // type: Schema.Types.ObjectId,
        // ref: 'User',
        // required: [true, 'Recipe must include author'] },
        rating: {
            type: Number,
            min: [1, "Invalid Rating"],
            max: [5, "Invalid Rating"]
        },
        numReviews: {
            type: Number,
            default: 0
        },
        tags: [{ type: String, default: [] }],
        time: {
            type: Number,
            required: [true, "Time estimate required!"]
        },
        nutrition: {
            type: Object,
            default: {}
        },
        difficulty: { type: String, default: "Unspecified" },
        tools: [{ type: String, default: [] }],
        posted: {
            type: Date,
            default: new Date()
        },
        ingredients: {
            type: Object,
            default: {}
        },
        // ingredients: [{ingredient: String, quantity: Number, measurement: String}],
        //Going to want to make an ingredient model soon, so this would be:
        //ingredients: [{Ingredient: {type: Schema.Types.ObjectID, ref: 'Ingredient'}, quantity: Number}]

        instructions: {
            type: [{ type: String, default: [] }],
            required: [true, "Recipe can not be empty"]
        },
        circumstances: { type:String, default: "" },
        reasoning: { type:String, default:""},
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        url: {
            type: String,
            default: "/Chicken-Fajitas.jpg"
        }
    },
    {
        timestamps: true
    }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
