const express = require("express");
const router = express.Router();
const { isLoggedin } = require("./middlewares");

const request = require("request");
const cheerio = require("cheerio");

router.get("/", isLoggedin, (req, res) => {
  const title = "COVID19 MAP";
  res.render("index", {
    title: title,
  });
});

router.post("/login", (req, res) => {
  // 데이터베이스에 이메일이 존재하는지 확인한다.
  User.findOne({ email: req.body.email })
    .then((doc) => {
      // 이메일이 존재한다면 비밀번호를 확인한다.
      if (doc) {
        doc.comparePassword(req.body.password, (err, isMatch) => {
          // 일치한다면 토큰을 생성한다.
          if (isMatch) {
            // JWT
            doc.generateToken((err, doc) => {
              if (err) return res.status(400).send(err);
              // 쿠키에 토큰을 저장한다.
              // 다른 곳에도 가능..
              res.cookie("auth", doc.token).status(200).json({
                loginSuccess: true,
                userId: doc._id,
              });
            });
          } else {
            res.json({
              loginSuccess: false,
              message: "이메일이나 비밀번호를 확인해주세요.",
            });
          }
        });
      } else {
        res.json({
          loginSuccess: false,
          message: "이메일이나 비밀번호를 확인해주세요.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
router.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, result) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// 데이터 출처 : https://www.data.go.kr/data/15043378/openapi.do
router.get("/main", (req, res) => {
      res.render("main");
    }
);


module.exports = router;
