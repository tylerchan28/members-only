var User = require("../models/user");
var bcrypt = require("bcryptjs");
const passport = require("passport");

exports.user_create_get = function (req, res, next) {
    res.render("sign_up_form", { title: "Sign Up" })
}

exports.user_create_post = function(req, res, next) {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      const user = new user({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
        member: false
      }).save(err => {
        if (err) { return next(err) }
      })
    })
    res.redirect("/login")
  }

exports.user_login_get = function (req, res, next) {
    res.render("login_form")
}

exports.user_login_post = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/catalog/login',
    
});