var express = require('express');
const User = require('../models/user');
var router = express.Router();
const bcrypt = require("bcryptjs");
var userController = require("../controllers/userController");

/* GET home page. */
router.get('/', function(req, res, next) { // this is where all content will be loaded
  res.render('index', { title: 'Members Only' });
});

router.get("/sign-up", userController.user_create_get);
router.post("/sign-up", userController.user_create_post);

router.get("/login", userController.user_login_get);


module.exports = router;
