// middelware : 요청 및 응답주기와 요청 및 응답 개체에 액세스
// -> 엔드 포인트에 도달 할 때마다 미들웨어 실행(토큰의 헤더를 이용)

const jwt = require("jsonwebtoken");
const config = require("config");

//next : 다음 미들웨어로 이동하는 기능
//module : 객체들의 집합소  / module.exports : 최종적인 리턴값이 module.exports
//간단하게 function이 바로 실행 and module.exports로 리턴
module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token"); //헤더 내부의 토큰에 대한 키

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); // 토큰 전달
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
