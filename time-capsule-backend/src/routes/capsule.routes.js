import { Router } from "express";
import {
    createCapsule,
    userAllCapsules,
} from '../controllers/capsule.controller.js'

const router = Router()
router.route("/create-capsule").post(createCapsule)
router.route("/getAll-Capsule").get(userAllCapsules)
export default router
