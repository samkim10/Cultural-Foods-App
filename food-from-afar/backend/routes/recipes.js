"use strict";
var express = require("express");
var bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
mongoose.set("debug", true);
var router = express.Router();
let log = console.log;
var app = express();

let recipe = require("../models/recipe.model");
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// MUST BE IN THE FORMAT OF:
// Body: {first_param: <param_val>, second_param: <second_val>, ...}
// Required params: name, creator, time, instructions
// All others can be instantiated with default values
router.route("/add").post((req, res) => {
    let recipeBuilder = {};
    let valid = true;
    if (req.body.hasOwnProperty("name")) {
        const name = req.body.name;
        recipeBuilder.name = name;
    } else {
        valid = false;
        log("Name Missing!");
    }

    if (req.body.hasOwnProperty("creator")) {
        const creator = req.body.creator;
        recipeBuilder.creator = creator;
    } else {
        valid = false;
        log("Creator Missing!");
    }

    if (req.body.hasOwnProperty("rating")) {
        const rating = req.body.rating;
        recipeBuilder.rating = rating;
    }

    if (req.body.hasOwnProperty("category")) {
        const category = req.body.category;
        recipeBuilder.category = category;
    }

    if (req.body.hasOwnProperty("numReviews")) {
        const numReviews = req.body.numReviews;
        recipeBuilder.numReviews = numReviews;
    }

    if (req.body.hasOwnProperty("tags")) {
        const tags = req.body.tags;
        recipeBuilder.tags = tags;
    }

    if (req.body.hasOwnProperty("time")) {
        const time = req.body.time;
        recipeBuilder.time = time;
    } else {
        valid = false;
        log("Time Missing!");
    }

    if (req.body.hasOwnProperty("nutrition")) {
        const nutrition = req.body.nutrition;
        recipeBuilder.nutrition = nutrition;
    }

    if (req.body.hasOwnProperty("tools")) {
        const tools = req.body.tools;
        recipeBuilder.tools = tools;
    }

    if (req.body.hasOwnProperty("difficulty")) {
        const difficulty = req.body.difficulty;
        recipeBuilder.difficulty = difficulty;
    }

    if (req.body.hasOwnProperty("posted")) {
        const posted = req.body.posted;
        recipeBuilder.posted = posted;
    }

    if (req.body.hasOwnProperty("ingredients")) {
        const ingredients = req.body.ingredients;
        recipeBuilder.ingredients = ingredients;
    }

    if (req.body.hasOwnProperty("instructions")) {
        const instructions = req.body.instructions;
        recipeBuilder.instructions = instructions;
    } else {
        valid = false;
        log("Instructions Missing!");
    }
    if (req.body.hasOwnProperty("reasoning")) {
        const reasoning = req.body.reasoning;
        recipeBuilder.reasoning = reasoning;
    }

    if (req.body.hasOwnProperty("circumstances")) {
        const circumstances = req.body.circumstances;
        recipeBuilder.circumstances = circumstances;
    }

    if (req.body.hasOwnProperty("reviews")) {
        const reviews = req.body.reviews;
        recipeBuilder.reviews = reviews;
    }

    if (req.body.hasOwnProperty("url")) {
        const url = req.body.url;
        recipeBuilder.url = url;
    }

    if (valid) {
        const newrecipe = new recipe(recipeBuilder);

        newrecipe
            .save()
            .then(() => res.status(200).send("recipe Created."))
            .catch((err) => res.status(400).send("Error: " + err));
        /*
    newrecipe.save()
      .then(() => res.json('recipe Created.'))
      .catch(err => res.status(400).json('Error: ' + err));
  
      recipe.findOne({ title: title}).populate('author').exec(function (err, recipe) {
        if (err || result === null) console.log("Invalid Author");
        console.log('Author successfully added');
      });*/
    } else {
        res.status(422).send("Malformed request");
    }
});

// MUST BE IN THE FORMAT:
// Query: {attribute_to_query: val_to_query, ...}
// USE THIS FOR SEARCH!! You can search by partial titles which makes the search bar work

// NOTE FOR FRONTEND- when searching for time, please send an object of this type:
// {time: {min: <minutes>, max: <minutes>}}
// this is because the filters use ranges
router.route("/").get((req, res) => {
    let query = req.query;
    if (query.hasOwnProperty("name")) {
        query["name"] = { $regex: query.name, $options: "i" };
    }

    if (query.hasOwnProperty("rating")) {
        if (Array.isArray(query.rating)) {
            //if ratings is an array of possible rating
            query["rating"] = { $in: query.rating };
        } else {
            //if ratings is a number, find all greater than or equal to that number
            query["rating"] = { $gte: query.rating };
        }
    }

    if (query.hasOwnProperty("posted")) {
        //posted must be a date or string that can be parsed as one, if so, gets all with date after or equal
        if (!(typeof query.posted.getMonth === "function")) {
            // checks if posted is a valid date
            let date = Date.parse(query.posted);
            if (isNaN(date)) {
                res.status(422).send("Date format invalid");
                return;
            } else {
                query["posted"] = { $gte: date };
            }
        } else {
            query["posted"] = { $gte: query.posted };
        }
    }

    if (query.hasOwnProperty("updatedAt")) {
        //updatedAt must be a date or string that can be parsed as one, if so, gets all with date after or equal
        if (!(typeof query.updatedAt.getMonth === "function")) {
            // checks if updatedAt is a valid date
            let date = Date.parse(query.updatedAt);
            if (isNaN(date)) {
                res.status(422).send("Date format invalid");
                return;
            } else {
                query["updatedAt"] = { $gte: date };
            }
        } else {
            query["updatedAt"] = { $gte: query.updatedAt };
        }
    }

    if (query.hasOwnProperty("numReviews")) {
        if (Array.isArray(query.numReviews)) {
            //if numReviews is an array of possible numbers of reviews
            query["numReviews"] = { $in: query.numReviews };
        } else {
            //if numReviews is a number, get all recipes with equal or more reviews
            query["numReviews"] = { $gte: query.numReviews };
        }
    }

    if (query.hasOwnProperty("tags") && Array.isArray(query.tags)) {
        query["tags"] = { $in: query.tags };
    }

    if (req.query.hasOwnProperty("time")) {
        if (
            typeof query.time === "object" &&
            !Array.isArray(query.time) &&
            query.time !== null
        ) {
            query["time"] = { $gte: query.time.min, $lte: query.time.max };
        }
    }

    if (query.hasOwnProperty("difficulty") && Array.isArray(query.difficulty)) {
        query["difficulty"] = { $in: query.difficulty };
    }

    if (query.hasOwnProperty("tools") && Array.isArray(query.tools)) {
        query["tools"] = { $in: query.tools };
    }

    if (query.hasOwnProperty("category") && Array.isArray(query.category)) {
        //needs testing!
        query["category"] = { $in: query.category };
    }

    if (query.hasOwnProperty("ingredients")) {
        // NEEDS WORK
        if (Array.isArray(query.ingredients)) {
            query.ingredients.forEach((item) => {
                let qString = "ingredients." + item;
                query[qString] = { $exists: true };
            });
        } else {
            let qString = "ingredients." + query.ingredients;
            query[qString] = { $exists: true };
        }
    }
    console.log(query);

    recipe
        .find(query)
        .lean()
        .then(function (result) {
            if (result) {
                res.status(200).send(result);
            }
        });
});

router.route("/:id").get((req, res) => {
    recipe.findById(req.params.id, (error, result) => {
        if (error || result === null) {
            log("Error when finding recipe by ID");
        } else {
            res.send(result);
        }
    });
});

// MUST BE IN THE FORMAT:
// query: {update: {param_to_update: <updated_value>, other_param: <other_value>, ...}}
router.route("/:id").patch((req, res) => {
    const update = req.query;
    console.log("update", update);
    console.log(Object.keys(update).length);
    if (!Object.keys(update).length) {
        res.status(422).send("Empty query");
        return;
    }
    recipe.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true },
        (error, result) => {
            if (result === null) {
                log("Error when updating recipe");
                res.status(404).send("Recipe not found");
            } else if (error) {
                res.status(422).send("Malformed request");
            } else {
                res.json(result);
            }
        }
    );
});

//MUST BE IN THE FORMAT:
// Body: {id: <document_id>}
router.route("/:id").delete((req, res) => {
    recipe.findByIdAndDelete(req.params.id, (error, result) => {
        if (error) {
            log("Error when deleting recipe");
            res.status(500).send("Internal server error!");
        } else if (result === null) {
            res.status(404).send("Recipe not found");
        } else {
            res.status(200).send("Recipe deleted");
        }
    });
});

//Old API. Possibly Temporary. Adding it in so its not broken for now. -Sam.
// Body: {id: <document_id>, update: {param_to_update: <updated_value>, other_param: <other_value>, ...}}
router.route("/find/update").post((req, res) => {
    const update = req.body.update;
    recipe.findByIdAndUpdate(
        req.body.id,
        update,
        { new: true },
        (error, result) => {
            if (error || result === null) {
                log("Error when updating recipe");
            } else {
                res.json("Recipe updated");
            }
        }
    );
});

module.exports = router;
