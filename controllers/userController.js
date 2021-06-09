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
  successRedirect: "/",
  failureFlash: true
});

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect("/");
}

exports.user_member_get = function (req, res) {
  res.render("member_form", { user: req.user });
}

exports.user_member_post = [
  body("code")
    .custom((value) => {
      if (value === "member") {
        return true
      } else {
        throw new Error("That's not the secret code! Try again!")
      }
    }).escape(),
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.render("member_form", { errors: errors.array() })
      } else {
        User.findByIdAndUpdate(req.user._id, { member: true }, {}, (err) => {
          if (err) { return next(err) }
          res.redirect("/")
        })
      }
    }
]

exports.user_admin_get = function(req, res) {
  res
  .render("admin_form", { user: req.user })
}

exports.user_admin_post = [
  body("code")
    .custom((value) => {
      if (value === "admin") {
        return true
      } else {
        throw new Error("That's not the secret code! Try again!")
      }
    }).escape(),
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.render("admin_form", { errors: errors.array() })
      } else {
        User.findByIdAndUpdate(req.user._id, { admin: true }, {}, (err) => {
          if (err) { return next(err) }
          res.redirect("/")
        })
      }
    }
]