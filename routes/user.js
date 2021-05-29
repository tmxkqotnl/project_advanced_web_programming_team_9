const express = require("express");
const router = express.Router();
const passport = require("passport");
const { User } = require("../models/User");

router.get("/info", async (req, res, next) => {
  try {
    if (req.session.passport) {
      let result = await User.findById(req.session.passport.user, "address age").exec();
      return res.json({
        age: result.age,
        address: result.address,
      });
    } else {
      console.log("info 정보 열람 불가");
      return res.json({
        message: "로그인이 필요합니다.",
      });
    }
  } catch (err) {
    console.error("info 문제 발생 : " + err);
    return res.json({
      message: "예상치 못한 에러",
    });
  }
});

module.exports = router;
