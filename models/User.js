// 모델 내부에 스키마 생성
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, //현재 날짜를 기본값으로 지정
  },
});

module.exports = mongoose.model("user", UserSchema); //user - model  / UserSchema - Schema
