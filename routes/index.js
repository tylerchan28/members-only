var express = require('express');
var router = express.Router();
var userController = require("../controllers/userController");
var messageController = require("../controllers/messageController");

/* GET home page. */
// router.get('/', function(req, res, next) { // this is where all content will be loaded
//   res.render('index', { title: 'Members Only', user: req.user });
// });

// User Routes
router.get("/sign-up", userController.user_create_get);
router.post("/sign-up", userController.user_create_post);

router.get("/login", userController.user_login_get);
router.post("/login", userController.user_login_post);

router.get("/logout", userController.user_logout_get);

router.get("/become-a-member", userController.user_member_get);
router.post("/become-a-member", userController.user_member_post);

// Message Routes
router.get("/", messageController.get_messages);
router.post("/", messageController.create_message)

module.exports = router;
