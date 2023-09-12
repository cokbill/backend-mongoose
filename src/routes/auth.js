const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

router.post("/signup", authController.signup);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

// router.post("/refreshtoken", authController.refreshToken);

module.exports = router;