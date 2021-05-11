// 연락처
// get: 받다 POST: 만들다 PUT: 수정하다 DELETE: 지우다.
const express = require("express");
const router = express.Router(); //라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 한다.
const auth = require("../middleware/auth"); // 경로 보호를 위해서 사용
const { check, validationResult } = require("express-validator/check"); //유효성 검사

const User = require("../models/User");
const Contact = require("../models/Contact");

// 추가, 게시 /사용자를 등록
// @route     GET api/contacts
// @desc      Get all users contacts
// @access    Private
// '/'은 server.js에서 전달받은 api/contacts가 할당
// 모든 연락처를 얻으려면 보호된 경로 or 개인 경로
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    }); //최신 데이터 조회
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route     POST api/contacts
// @desc      Add new Contact
// @access    Private
router.post(
  "/",
  [auth, [check("name", "Name is requried").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //오류 데이터 + json 데이터
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id, //사용자는 미들웨어 권한을 사용한다. auth에서 권한을 받는다?
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/contacts/:id
// @desc      Update contact
// @access    Private
router.put("/:id", auth, async (req, res) => {
  //models.Contact 기준으로 변수 선언
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name; //필드 추가
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id); //"/:id"(매개변수 id로 연락처를 찾을 수 있음)
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    // 사용자가 연락처를 소유하고 있는지 확인
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // 업데이트 수행
    cpmtact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields }, //Schema를 업데이트($는 오직 1개의 필드만 변경)
      { new: true } //Update를 실행한 뒤의 정보를 받고 싶다면 new 옵션
    );
    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     DELETE api/contacts/:id
// @desc      Delete contact
// @access    Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id); //"/:id"(매개변수 id로 연락처를 찾을 수 있음)
    if (!contact) return res.status(404).json({ msg: "Contact not found" });
    // 사용자가 연락처를 소유하고 있는지 확인
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    // 삭제 수행
    await Contact.findByIdAndRemove(req.params.id);
    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 모듈 내보내기 / 라우터 확인으로 설정
module.exports = router;
