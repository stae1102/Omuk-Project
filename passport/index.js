import passport from "passport";
import User from "../models/user.js";
import kakao from "./kakaoStrategy.js";
import local from "./localStrategy.js";

export default () => {
  /** 사용자 세션 작성 */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  /** 사용자 세션 해석 */
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
  kakao();
};
