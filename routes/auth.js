import express from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";

import { isLoggedIn, isNotLoggedIn } from "../middlewares/authCheck.js";

const router = express.Router();

/** 로그인 라우트 */
router
  .route("/signin")
  .get(userController.getSignIn)
  .post(isNotLoggedIn, userController.postSignIn);

/** 로그아웃 라우트 */
router.get("/logout", isLoggedIn, userController.logOut);

/** 회원가입 라우트 */
router
  .route("/signup")
  .get(isNotLoggedIn, userController.getSignup)
  .post(isNotLoggedIn, userController.postSignUp)
  .patch(userController.patchSignup)
  .delete(userController.deleteSignup);

/** 카카오 API */
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
