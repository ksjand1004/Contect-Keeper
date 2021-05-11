// 모델 내부에 스키마 생성
const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // MongoDB로 항목을 만들 때 문서에 있는 객체 ID의 타입
    ref: "users", //참조
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    default: "personal",
  },
  date: {
    type: Date,
    default: Date.now, //현재 날짜를 기본값으로 지정
  },
});

module.exports = mongoose.model("contact", ContactSchema); //contact - model  / ContectSchema - Schema
