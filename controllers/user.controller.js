import User from "../models/user.js";
import passport from "passport";

// 회원가입
/** 회원가입 페이지 방문 */
const getSignup = (req, res) => {
  res.render("signup");
};
/** 회원가입 시도 */
const postSignUp = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect(304, "/signup");
    }
    await User.create({
      email,
      nickname,
      password,
    });
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

/** 닉네임 변경 */
const patchSignup = async (req, res, next) => {
  try {
    const result = await User.update(
      {
        nickname: req.body.nickname,
      },
      { where: { email: req.body.email } }
    );
    res.send(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
/** 회원 탈퇴 */
const deleteSignup = async (req, res, next) => {
  try {
    const result = await User.destroy({
      where: { email: req.body.email },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

/** 로그인 페이지 생성 */
const getSignIn = (req, res, next) => {
  res.render("signin");
};

/** 로그인 시도 함수 */
const postSignIn = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      console.log("successed");
      return res.redirect("/");
    });
  })(req, res, next);
};

/** 로그아웃 */
const logOut = (req, res) => {
  req.logout((err) => {
    req.session.destroy();
    if (err) return next(err);
    else res.redirect("/");
  });
};

export default {
  /** GET */
  getSignIn,
  getSignup,
  logOut,

  /** POST */
  postSignIn,
  postSignUp,

  /** PATCH */
  patchSignup,
  deleteSignup,
};
