const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");

const { User } = require("../model/usermodel");
const { Otp } = require("../model/otpModel");

module.exports.OtpSending = async (req, res) => {
    try {
        const user = await User.findOne({ number: req.body.number });

        if (user) {
            return res.status(400).send("User already registered!!");
        }

        const OTP = otpGenerator.generate(6, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });

        const number = req.body.number;

        console.log(OTP);

        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(OTP, salt);

        const otp = new Otp({ number: number, otp: hashedOTP });
        const result = await otp.save();

        // Send OTP to frontend as JSON response
        return res.status(200).json({ message: "OTP sent Successfully!!", otp: OTP });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.verifyOtp = async (req, res) => {
    try {
        const otpHolder = await Otp.find({
            number: req.body.number,
        });

        if (otpHolder.length === 0) return res.status(400).send("You used an Expired OTP!");

        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

        if (rightOtpFind.number === req.body.number && validUser) {
            const user = new User(_.pick(req.body, ["number"]));
            const token = user.generateJWT();
            const result = await user.save();

            // Delete used OTP
            const OTPDelete = await Otp.deleteMany({
                number: rightOtpFind.number,
            });

            return res.status(200).json({
                message: "User Registration SuccessFull!!",
                token: token,
                data: result,
            });
        } else {
            return res.status(400).send("Your OTP is Wrong");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
};
