import { Router } from "express";
import {
    createCapsuleController,
    userAllCapsules,
} from '../controllers/capsule.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import{upload} from '../middlewares/multer.middleware.js';

const router = Router()
router.route("/create-capsule").post(verifyJWT,upload.single('file'),createCapsuleController)
router.route("/getAll-Capsule").get(userAllCapsules)
export default router
