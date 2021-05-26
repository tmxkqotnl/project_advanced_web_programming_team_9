// var createError = require('http-errors');
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");

const { MONGO_URI } = require("./config/Keys");
const indexRouter = require("./routes/index");

// const covid19data = require('./public/data/covid19');
// const dustdata = require('./public/data/dust');

const app = express();
dotenv.config();

app.set("view engine", "ejs"); // set view engine
app.set("views", path.join(__dirname, "views")); // set path of view
app.set("port", process.env.PORT || 8002); // set port number

app.use(
  process.env.NODE_ENV === "production" ? morgan("combined") : morgan("dev")
); // set morgan
app.use(express.json()); // set body parser
app.use(express.urlencoded({ extended: true })); // set querystring module
app.use(cookieParser()); // set cookie parser
app.use(express.static(path.join(__dirname, "public"))); // set dir of static files

// connect to mongo Atlas
mongoose.connect(
  MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (!err) {
      console.log('DB Connected ... ');
      // listening
      app.listen(app.get("port"), () => {
        console.log("Listening on " + app.get("port"));
      });
    } else {
      console.error(err);
    }
  }
);

app.use("/", indexRouter);
// 404 errorCode handler
app.use((req, res, next) => {
  const err = new Error("NOT FOUND 404");
  res.status(404);
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
  });
});
