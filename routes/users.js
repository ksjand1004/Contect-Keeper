// 사용자
// 웹토큰 참조 : https://medium.com/sjk5766/jwt-json-web-token-%EC%86%8C%EA%B0%9C-49e211c65b45
const express = require("express");
const router = express.Router(); //라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 한다.
const bcrypt = require("bcryptjs"); // 암호화
const jwt = require("jsonwebtoken"); //웹토큰 / 정보를 안전하게 전송
const config = require("config");
const { check, validationResult } = require("express-validator/check"); //유효성 검사
const User = require("../models/User");

// 추가, 게시 /사용자를 등록
// @route     POST api/users
// @desc      유저 등록
// @access    공개여부(public)
// '/'은 server.js에서 전달받은 api/users가 할당
router.post(
  // "/" 루트 경로
  "/",
  // post의 2번쨰 프로퍼티에 유효성검사 사항 및 문구 삽입
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or mare characters"
    ).isLength({ min: 6 }),
  ],
  // 3번째 프로퍼티는 유효성검사 이후 유효성 여부 출력 및 정상 시 소스 코드 작성
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //오류 데이터 + json 데이터
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email }); //Mongoose와 함께 사용 가능 / 모든 필드를 기반으로 사용자를 찾음  / email변수로 email에 맞는 사용자를 찾음
      if (user) {
        return res.status(400).json({ msg: "User already exists" }); // user가 존재하면 오류 처리
      }
      //값 저장
      user = new User({
        name,
        email,
        password,
      });
      //암호화
      const salt = await bcrypt.genSalt(10); //암호보안의 정도 (기본값 : 10)
      user.password = await bcrypt.hash(password, salt);
      //DB에 저장
      await user.save();
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// 모듈 내보내기 / 라우터 확인으로 설정
module.exports = router;
