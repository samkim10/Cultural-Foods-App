var express = require("express");
const { default: mongoose } = require("mongoose");
mongoose.set("debug", true);
var router = express.Router();

let tag = require("../models/tag.model");

router.route("/").get((req, res) => {
    tag
        .find()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(400).json("Tag get Error: " + err));
});

router.route("/add").post((req, res) => {
    const content = req.body.content;

    const newTag = new tag({ content });

    newTag
        .save()
        .then(() => res.json("tag Created."))
        .catch((err) => res.status(400).json("tag add Error: " + err));
});

module.exports = router;
