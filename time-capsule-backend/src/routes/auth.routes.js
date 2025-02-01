import {Router} from "express";
import {
    registerUser,
    login,
    forgotPassword,
    logout
} from '../controllers/auth.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/forgot-password").patch(forgotPassword)

export default router;