const express = require("express");
const router = express.Router();
const passport = require('passport');
const { isLoggedIn,isNotLoggedIn,checkContent,makeUser } = require("./middlewares");

router.get("/", isNotLoggedIn, (req, res) => {
  const title = "COVID19 MAP";
  res.render("index", {
    title: title,
  });
});
router.post("/login", isNotLoggedIn, checkContent, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.render("index", {
        message:"Check your Email or Password",
      });
    }

    return req.login(user, (loginError) => {
      console.error(loginError);
      if (loginError) {
        return next(loginError);
      }
      return res.redirect("/main");
    });
  })(req, res, next);
});

router.post("/register",isNotLoggedIn,checkContent,makeUser, (req, res) => {
  res.redirect('/');
});

router.get("/main",isLoggedIn, (req, res) => {
      res.render("main");
});


module.exports = router;
