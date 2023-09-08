const router = require('express').Router();
const {OtpSending,verifyOtp} = require("../controllers/userController");

router.route("/otpgenration")
.post(OtpSending);
router.route("/signup/verify")
.post(verifyOtp);

module.exports = router;