var express = require("express");
const { default: mongoose } = require("mongoose");
mongoose.set("debug", true);
var router = express.Router();

let category = require("../models/category.model");

router.route("/").get((req, res) => {
    category
        .find()
        .then((categories) => res.json(categories))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/id/:id').get((req, res) => {
    category.findById({_id: req.params.id}, (error, result) =>{
      if(error || result === null){
        console.log("Error when finding category by ID")
      }else{
        res.send(result)
      }
    });
  })

  router.route('/content/:content').get((req, res) => {
    category.findOne({content: req.params.content}, (error, result) =>{
      if(error || result === null){
        console.log("Error when finding category by content/region-name")
      }else{
        res.send(result)
      }
    });
  })


router.route("/add").post((req, res) => {
    const content = req.body.content;
    const alt = req.body.alt;
    const url = req.body.url;

    const newcategory = new category({ content, alt, url });

    newcategory
        .save()
        .then(() => res.json("category Created."))
        .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
