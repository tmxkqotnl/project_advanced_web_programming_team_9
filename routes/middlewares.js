const { User } = require("../models/User");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.status(403).redirect("/");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/main`);
  }
};
exports.checkContent = (req, res, next) => {
  if (!req.body.email || req.body.email >= 60 || !req.body.password) {
    return res.redirect("/");
  }
  next();
};
exports.makeUser = (req, res, next) => {
  const newUser = new User(req.body);
  newUser.save((err, result) => {
    if (err) {
      return res.render("index", { message: "unexpected Error...", err });
    }
    console.log("DB Communication Success");
    next();
  });
};
