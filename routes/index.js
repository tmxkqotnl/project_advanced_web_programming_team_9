const { next } = require("cheerio/lib/api/traversing");
const express = require("express");
const router = express.Router();
const passport = require('passport');
const { isLoggedIn,isNotLoggedIn,checkContentLogin,checkContentRegister,makeUser } = require("./middlewares");

global.loggedIn =null;
router.use("*",(req,res,next) => {
  loggedIn = req.session.passport;
  next()
});

router.get("/", (req, res) => {
  res.render("main");
});

router.get("/login", isNotLoggedIn,(req, res) => {
  res.render("login");
});

router.post("/login", isNotLoggedIn, checkContentLogin, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.render("login", {
        message:"Check your Email or Password",
      });
    }

    return req.login(user, (loginError) => {
      // console.error(loginError);
      if (loginError) {
        return next(loginError);
      }
      console.log("Login: "+user); // for check
      return res.redirect("/");
    });
  })(req, res, next);
});

router.post("/register",isNotLoggedIn,checkContentRegister,makeUser, (req, res,next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.render("login", {
        message:"예상치 못한 에러 발생, 관리자에게 문의하세요.",
      });
    }
    return req.login(user, (loginError) => {
      console.error(loginError);
      if (loginError) {
        return next(loginError);
      }
      console.log("Register: "+user); // for check
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get('/logout',isLoggedIn, (req,res,next)=>{
  req.logout();
  req.session.destroy(err=>{
    if(err) {
      console.error('세션 초기화 실패');
      return next(err);
    }
    return res.redirect('/');
  });
});



module.exports = router;
