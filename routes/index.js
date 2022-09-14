import express from "express";

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get("/", (req, res) => {
  res.render("home");
});

export default router;
