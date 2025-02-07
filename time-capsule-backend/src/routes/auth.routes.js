import {Router} from "express";
import {
    sendOTP,
    verifyOTPAndLogin,
    logout
} from '../controllers/auth.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTPAndLogin);
router.route("/logout").post(verifyJWT,logout)


export default router;