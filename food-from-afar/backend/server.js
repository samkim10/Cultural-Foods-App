const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const startDatabase = require("./database");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// deployment for heroku
var path = require("path");
app.use(express.static(path.join(__dirname, "./../frontend/build")));

app.use("/CultureHub", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

app.use("/AboutUs", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

app.use("/Recipe/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

app.use("/UserProfile/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

app.use("/Login", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

app.use("/Register", (req, res) => {
    res.sendFile(path.join(__dirname, "./../frontend/build/index.html"));
});

connection = startDatabase();

app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const recipesRouter = require("./routes/recipes");
app.use("/recipes", recipesRouter);

const categoriesRouter = require("./routes/categories");
app.use("/categories", categoriesRouter);

const reviewsRouter = require("./routes/reviews");
app.use("/reviews", reviewsRouter);

const tagsRouter = require("./routes/tags");
app.use("/tags", tagsRouter);

app.listen(port, () => {
    console.log("server running on port: " + port);
});

module.exports = app;
