/**************************************
 **************************************
 ********** 서버 기반 도구들 **********
 **************************************
 **************************************/

import express from "express";

// 기타 라이브러리
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import dotenv from "dotenv";
dotenv.config();
import favicon from "serve-favicon";

// 미들웨어
import expressHandlebars from "express-handlebars";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import expressSession from "express-session";

// 데이터베이스
import db from "./models/index.js";
db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch((err) => {
    console.log("연결 실패", err);
  });

// 라우트
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";

// 로거
import logger from "./logger.js";

// 배포시 유용한 패키지
import helmet from "helmet";
import hpp from "hpp";

// 레디스 & 패스포트 설정
import { createClient } from "redis";
import rs from "connect-redis";
import passport from "passport";
import passportConfig from "./passport/index.js";
const redisClient = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});
const RedisStore = rs(expressSession);
redisClient.connect().catch(console.error);

/**************************************
 **************************************
 *********** 서버 설정 시작 ***********
 **************************************
 **************************************/

const app = express();
passportConfig();

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// 템플릿 엔진 설정
app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
// 미들웨어
// 1. 로그
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}
// 2. 정적 폴더 지정
app.use(express.static(path.join(__dirname, "public")));
// 3. HTTP 요청 패킷 바디
app.use(express.json());
// 4. Form 데이터
app.use(express.urlencoded({ extended: false }));
// 5. cookieParser
app.use(cookieParser(process.env.COOKIE_SECRET));
// 6. 세션
const sessionOption = {
  resave: false,
  secret: process.env.COOKIE_SECRET,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    client: redisClient,
    logErrors: true,
  }),
};
if (process.env.NODE_ENV === "production") {
  sessionOption.proxy = true;
  // sessionOption.cookie.secure = true;
}
app.use(expressSession(sessionOption));
// 7. 패드포트
app.use(passport.initialize());
app.use(passport.session());

/*
  ####################################
  ############## 라우터 ##############
  ####################################
*/

// 메인 라우터
app.use("/", indexRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  logger.info("404 Error");
  logger.error(error.message);
  res.status(404).send("404 Error");
});
app.use((err, req, res, next) => {
  const error = new Error(
    `${req.method} ${req.url} 에서 심각한 에러가 발생했습니다.`
  );
  logger.info("500 Error");
  logger.error(error.message);
  res.status(500).send("Server Error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your Express app has been started at http://localhost:${port}`);
});
