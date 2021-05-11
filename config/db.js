const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

//mongoose는 promise를 반환 -> 궁극적으로 동기화 대기를 사용
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, //없을 시 경고 나옴 // 글로벌 성정을 해주는 부분이라서 크게 신경 안써도 됨
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected.");
  } catch (err) {
    // 예외적용
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

/*
async - await로 리팩토링 전 Connect 코드
 mongoose
    .connect(db, {
      useNewUrlParser: true, //없을 시 경고 나옴 // 글로벌 성정을 해주는 부분이라서 크게 신경 안써도 됨
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected")) // 실제로 동기화 대기를 사용하여 작업을 수행
    .catch((err) => {
      // 예외적용
      console.error(err.message);
      process.exit(1);
    });
*/
