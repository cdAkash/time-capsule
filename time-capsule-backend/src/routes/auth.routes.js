import {Router} from "express";
import {
    registerUser,
    login,
    forgotPassword,
} from '../controllers/auth.controller.js'

const router = Router();
router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/forgot-password").patch(forgotPassword)

export default router;