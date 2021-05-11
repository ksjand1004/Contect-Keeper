// 백앤드 진입점

// 참조 : https://developer.mozilla.org/ko/docs/Learn/Server-side/Express_Nodejs/Introduction
// express : Node 웹 프레임 워크 / HTTP 통신 요청에 대한 핸들러 / 미들웨어 패키지 역할 /
// require() : module.exports를 리턴한다 -> 모듈을 가져온다
//
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// 미들웨어 초기화  // 참조 : https://velog.io/@yejinh/express-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4-bodyParser-%EB%AA%A8%EB%93%88
app.use(express.json({ extended: false })); //node.js에 기본으로 내장된 queryString을 사용

//req : 요청 오브젝트, res: 응답 오브젝트(return으로 생각하면 편함)
//참조 : https://expressjs.com/ko/guide/writing-middleware.html
app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the ContatKeeper API..." })
);

//라우터 생성 / 가독성을 높이기 위해서 폴더안에 각각의 .js로 라우터 관리
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
