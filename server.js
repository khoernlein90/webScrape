const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const exphbs = require("express-handlebars");
const apiRoutes = require("./routes/apiRoutes")
const htmlRoutes = require("./routes/htmlRoutes")

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(htmlRoutes)
app.use(apiRoutes)

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrape";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});