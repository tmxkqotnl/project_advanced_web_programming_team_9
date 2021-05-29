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
    console.log('Logged in User');
    res.redirect(`/`);
  }
};
exports.checkContentLogin = (req, res, next) => {
  if (!req.body.email || req.body.email >= 60 || !req.body.password) {
    return res.redirect("/login");
  }
  next();
};
exports.checkContentRegister = (req, res, next) => {
  console.log(req.body);
  if (
    !req.body.email ||
    req.body.email >= 60 ||
    !req.body.password ||
    !req.body.age
  ) {
    console.log('invalide value');
    return res.render("login",{
      message:'모든 값을 기입해주세요.'
    });
  }
  next();
};
exports.makeUser = (req, res, next) => {
  const newUser = new User(req.body);
  newUser.save((err, result) => {
    if (err) {
      console.log("Client Error");
      return res.render("index", {
        message: "잘못 기입하셨습니다. 다시 시도해주세요.",
        err,
      });
    }
    console.log("유저 생성 성공");
    next();
  });
};
