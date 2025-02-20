import mongoose from "mongoose";
import { config } from "./config.js";

export default function connectDB() {
  return mongoose.connect(config.db.db_host, {
    useNewUrlParser: true, // 최신 URL 파서를 사용
    useUnifiedTopology: true, // 새로운 서버 디스커버리 엔진 사용 
  })
    .then(() => console.log("✅ MongoDB 연결 성공!"))
    .catch((err) => {
      console.error("❌ MongoDB 연결 실패:", err);
      process.exit(1); // 연결 실패 시 프로세스 종료
    });
}
