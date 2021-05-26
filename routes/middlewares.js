
const {User} = require('../models/User');

module.exports.isLoggedin = (req,res,next)=>{
  if(req.cookies.isAuth === 'true'){
    res.render('main');
  }else{
    next();
  }
}
// 
module.exports.auth = (req,res,next)=>{
  const tk = req.cookies.auth;

  User.findOne(tk, (err,user)=>{
    if(err) next(err);
    if(!user){
      return res.json({
        isAuth:false,
        error:true,
      });
    }else{
      req.token = tk;
      req.user = user;
      next();
    }
  });
}
