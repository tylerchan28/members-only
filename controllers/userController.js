var User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport")

exports.user_create_get = function (req, res, next) {
    res.render("sign_up_form", { title: "Sign Up" })
}

exports.user_create_post = [
  body("first_name").trim().isLength({ min: 1 }).escape().withMessage("First name must be specified")
    .isAlphanumeric().withMessage("First name has non-alphanumeric characters"),
  body("last_name").trim().isLength({ min: 1 }).escape().withMessage("Last name must be specified")
    .isAlphanumeric().withMessage("Last name has non-alphanumeric characters"),
  body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be specified")
  .isAlphanumeric().withMessage("Username has non-alphanumeric characters")
  .custom(async (username) => {
    try {
      const existingUsername = await User.findOne({ username: username })
      if (existingUsername) {
        throw new Error("Username is taken")
      }
    } catch (err) {
      throw new Error(err)
    }
  }),
  body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be specified"),
  body("confirm-password").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Passwords do not match")
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render("sign_up_form", { title: "Sign up", errors: errors.array() })
      return
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
        }).save(err => {
          if (err) { return next(err) }
        })
      })
      res.redirect('/login')
    }
  }
]

exports.user_login_get = function (req, res, next) {
    res.render("login_form", { title: "Login" })
}

exports.user_login_post = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/"
});

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect("/");
}