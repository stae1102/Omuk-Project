import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import User from "../models/user.js";

export default () => {
  passport.use(
    new LocalStrategy(
      {
        // input 태그의 name
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        if (email || password) {
          try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
              const result = password === exUser.password;
              if (result) {
                done(null, exUser);
              } else {
                done(null, false, { message: "password incorrected." });
              }
            } else {
              done(null, false, { message: "no user" });
            }
          } catch (err) {
            console.error(err);
            done(err);
          }
        }
      }
    )
  );
};
