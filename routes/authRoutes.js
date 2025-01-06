const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/logout", authController.logout);
router.get("/is-authenticated", authController.isAuthenticated);
router.get("/facebook", authController.facebookAuth);
router.get("/facebook/callback", authController.facebookCallback);

module.exports = router;
