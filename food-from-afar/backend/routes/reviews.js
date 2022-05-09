var express = require("express");
const { default: mongoose } = require("mongoose");
mongoose.set("debug", true);
var router = express.Router();

let review = require("../models/review.model");

router.route("/").get((req, res) => {
    review
        .find()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/recipe/:recipe").get((req, res) => {
    review.find({ recipe: { $eq: req.params.recipe } }, (error, result) => {
        if (error || result === null) {
            log("Error when finding review by recipe ID");
        } else {
            res.send(result);
        }
    });
});

router.route("/creator/:creator").get((req, res) => {
    review.find({ creator: { $eq: req.params.creator } }, (error, result) => {
        if (error || result === null) {
            log("Error when finding review by creator ID");
        } else {
            res.send(result);
        }
    });
});

router.route("/add").post((req, res) => {
    const creator = req.body.creator;
    const name = req.body.name;
    const recipe = req.body.recipe;
    const rating = req.body.rating;
    const content = req.body.content;

    const newReview = new review({ creator, name, recipe, rating, content });

    newReview
        .save()
        .then(() => res.json("review Created."))
        .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
