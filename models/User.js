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
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
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

// 문서 커스텀 메서드
userSchema.methods.comparePassword = function(plain,cb){
  bcrypt.compare(plain, this.password,(err,isMatch)=>{
    if(err) return cb(err);
    cb(null,isMatch);
  });
}
userSchema.methods.generateToken = function(cb){
  const user = this;

  // objectid는 인스턴스다.
  // 문자열로 변환
  const token = jwt.sign(user._id.toHexString(), process.env.JWT_SECRET);
  user.token = token;
  user.save().then(doc=>{
    cb(null,doc);
  }
  ).catch(err=>{
    console.log(err);
    cb(err);
  });
}
// 모델 스키마 함수
userSchema.statics.findByToken = function(tk,cb){
  const user = this;

  // 복호화
  jwt.verify(tk,process.env.JWT_SECRET,(err,decoded)=>{
    if(err) cb(err);

    user.findOne({_id:decoded, token:tk})
    .then(doc=>cb(null,doc))
    .catch(err=>{
      return cb(err);
    });
  });
}

// 몽구스 모델 스키마에 등록
const User = mongoose.model('User',userSchema);
// 외부에서 사용할 수 있도록 export
module.exports = {User};
