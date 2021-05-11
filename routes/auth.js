// 로그인한 유저 관리

const express = require("express");
const router = express.Router(); //라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 한다.
const bcrypt = require("bcryptjs"); // 암호화
const jwt = require("jsonwebtoken"); //웹토큰 / 정보를 안전하게 전송
const config = require("config");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator/check"); //유효성 검사
const User = require("../models/User");

// 추가, 게시 /사용자를 등록
// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
// '/'은 server.js에서 전달받은 api/auth 할당
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public
// '/'은 server.js에서 전달받은 api/auth 할당
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is reqried").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //오류 데이터 + json 데이터
    }

    const { email, password } = req.body;

    try {
      ////////////////////////////////////////////////////////////////////
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials(email)" }); // 자격 x
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials(password)" });
      }
      ////////////////////////////////////////////////////////////////////
      //토큰 전송 / id를 기반으로 특정 데이터를 받으 예정이라서 id만 보냄
      const payload = {
        user: {
          id: user.id,
        },
      };
      //첫번째 인자 : payload / 두번째 : 비밀키(비밀이기 떄문에 바로 입력 x )
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        //옵션
        {
          expiresIn: 3600, //토큰 만료 1시간
        },
        //Callback
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      ////////////////////////////////////////////////////////////////////
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// 모듈 내보내기 / 라우터 확인으로 설정
module.exports = router;
