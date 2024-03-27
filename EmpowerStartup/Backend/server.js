// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "*", // allow the server to accept requests from different origins
};

const path = require("path");

app.use(express.static(path.join(__dirname, "./uploads")));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// MongoDB connection
const dbConfig = require("./app/config/db.config");
mongoose
  .connect(dbConfig.url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use(bodyParser.json());

// // Routes
// simple route
app.get("/", (req, res) => {
  res.json({ message: "This is Startup Project Backend" });
});

require("./app/routes/user.routes")(app);
require("./app/routes/startup.routes")(app);
require("./app/routes/orders.routes")(app);
require("./app/routes/articles.routes")(app);
require("./app/routes/products.routes")(app);
require("./app/routes/sales.routes")(app);
require("./app/routes/startupType.routes")(app);
require("./app/routes/auditStartup.routes")(app);
require("./app/routes/donations.routes")(app);


require("./app/routes/analytics.routes")(app);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
