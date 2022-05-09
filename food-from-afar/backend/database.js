const mongoose = require("mongoose");
const log = console.log;
require("dotenv").config();

const startDatabase = () => {
    const uri = process.env.ATLAS_URI;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const connection = mongoose.connection;
    connection.once("open", () => {
        log("Database connected.");
    });
    connection.on("disconnected", function () {
        log("Database disconnected");
    });
    connection.on(
        "error",
        console.error.bind(console, "Database connection error!")
    );
    return connection;
};

module.exports = startDatabase;
