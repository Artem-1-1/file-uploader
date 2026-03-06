import passport from "passport";
import bcrypt from "bcryptjs";
import { addUserToDB } from "../db/queries.js";
import { body, validationResult, matchedData } from "express-validator";

const userValidateLogIn = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username must be not empty")
    .isLength({ min: 4 }).withMessage("Username must be least 4 symbols"),
  body("password")
    .trim()
    .notEmpty().withMessage("Password must be not empty")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .isLength({ min: 8 }).withMessage("Password must have at least 8 symbols")
]

function getLogIn(req, res) {
  res.render("login", { errors: [], username: "", password: "", title: "Log In" })
}

function postLogIn(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("login", {
      errors: errors.array(),
      username: req.body.username,
      password: req.body.password
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      const errors = [];
      if (info && info.message) {
        errors.push({ msg: info.message });
      }
      return res.status(400).render("login", {
        errors: errors,
        username: req.body.username,
        password: ""
      })
    }
    req.logIn(user, (err) => {
      if (err) return next(err)
      return res.redirect("/")
    });
  })(req, res, next);
}

const userValidateRegister = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 4, max: 50 }).withMessage("Username must have at least 4 letter and no more than 50 letter"),
  body("password")
    .trim()
    .notEmpty().withMessage("Password must be not empty")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .isLength({ min: 8 }).withMessage("Password must have at least 8 symbols"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    })
]

function getRegister(req, res) {
  res.render("register", { errors: [], username: "", password: "", confirmPassword: "", title: "Register" });
}

async function postRegister(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("register", {
      errors: errors.array(),
      username: req.body.username,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    })
  }

  const { username, password, confirmPassword } = matchedData(req);
  const hashedPassword = await bcrypt.hash(password, 10);
  await addUserToDB(username, hashedPassword);
  res.redirect("login");
}

export default { userValidateLogIn, getLogIn, postLogIn, userValidateRegister, getRegister, postRegister };