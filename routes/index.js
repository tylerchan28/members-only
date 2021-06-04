var express = require('express');
const User = require('../models/user');
var router = express.Router();
const bcrypt = require("bcryptjs");

/* GET home page. */
router.get('/', function(req, res, next) { // this is where all content will be loaded
  res.render('index', { title: 'Members Only' });
});

router.get("/sign-up", function(req, res, next) {
  res.render('sign_up_form', { title: 'Sign up' });
});

router.post("/sign-up", function(req, res, next) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      member: false
    }).save(err => {
      if (err) { return next(err) }
    })
  })
  res.redirect("/")
})

router.get("/login", function(req, res, next) {
  res.render("login_form", { title: "Log in"})
})
module.exports = router;
