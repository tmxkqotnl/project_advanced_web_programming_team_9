const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRound = 10; // change anytime

// user schema
const userSchema = mongoose.Schema({
  email:{
    require:true,
    type:String,
    maxlength:50,
    unique:true
  },
  password:{
    require:true,
    type:String,
    maxlength:30,
  },
  age:{
    require:true,
    type:Number,
    maxlength:3
  },
  address:{
    require:true,
    type:String,
    maxlength:4,
  }
});

// hashing this password
userSchema.pre('save',function(next){
  const user = this;
  // 비밀번호를 바꾸거나 새로운 유저인지 확인
  if(user.isModified || user.isNew){
    // 소금 만들기
    bcrypt.genSalt(saltRound,(err,salt)=>{
      if(err) return next(err);
      // 소금치기
      bcrypt.hash(this.password,salt,(err,hash)=>{
        if(err) return next(err);
        user.password = hash;
        next();
      })
    })
  }
});



// 몽구스 모델 스키마에 등록
const User = mongoose.model('User',userSchema);
// 외부에서 사용할 수 있도록 export
module.exports = {User};
