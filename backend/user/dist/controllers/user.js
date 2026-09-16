import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import tryCatch from "../config/tryCatch.js";
import { redisClient } from "../index.js";
import { User } from "../model/User.js";
export const loginUser = tryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        return res.status(429).json({
            message: "Too many requests. Please try again later."
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, { EX: 300 }); // Store OTP for 5 minutes
    await redisClient.set(rateLimitKey, "true", { EX: 60 }); // Mark as requested for 1 minute
    const message = {
        to: email,
        subject: "Your OTP for Login",
        body: `Your OTP for login is: ${otp}. It is valid for 5 minutes.`
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({
        message: "OTP sent successfully."
    });
});
export const verifyUser = tryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;
    if (!email || !enteredOtp) {
        return res.status(400).json({
            message: "Email and OTP are required.",
        });
    }
    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp || storedOtp !== enteredOtp) {
        return res.status(400).json({
            message: "Entered OTP is either expired or incorrect.",
        });
    }
    await redisClient.del(otpKey);
    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, 8);
        user = await User.create({ name, email });
    }
    const token = generateToken(user);
    return res.json({
        message: "User verified successfully.",
        user,
        token,
    });
});
export const myProfile = tryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Please login' });
    }
    res.json(user);
});
export const updateName = tryCatch(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.name = req.body.name;
    await user.save();
    const token = generateToken(user);
    res.json({
        message: "Username updated successfully.",
        user,
        token
    });
});
export const getAllUsers = tryCatch(async (req, res) => {
    const users = await User.find();
    res.json(users);
});
export const getAUser = tryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});
//# sourceMappingURL=user.js.map