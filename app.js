const express = require("express");
const session = require('express-session');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportindex = require('./passport');

const { MONGO_URI } = require("./config/Keys");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");

const app = express();
dotenv.config();
passportindex();

app.set("view engine", "ejs"); // set view engine
app.set("views", path.join(__dirname, "views")); // set path of view
app.set("port", process.env.PORT || 8002); // set port number


const server = async() => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }).then(res=>{
      console.log({res});
      console.log('DB Connected');
    });
    
    app.use(
      process.env.NODE_ENV === "production" ? morgan("combined") : morgan("dev")
    ); // set morgan
    app.use(express.json()); // set body parser
    app.use(express.urlencoded({ extended: true })); // set querystring module
    app.use(cookieParser()); // set cookie parser
    app.use(express.static(path.join(__dirname, "public"))); // set dir of static files
    app.use(session({ // set session
      resave: true,
      saveUninitialized: true,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/", indexRouter);
    app.use("/user", userRouter);

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

    app.listen(app.get("port"), () => {
      console.log("Listening on port " + app.get("port"));
    });
  } catch (err) {
    console.log("ERROR!!!");
    console.error(err);
  }
};

server();