import express from "express";

import {
    getUserProfile,
    getPublicProfile,
    updateUserProfile,
    uploadProfileImage,
} from "../controllers/profileController.js";

import { userValidation } from "../validations/userValidation.js";
import validateRequest from "../middlewares/validateRequest.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getUserProfile);

// Kisi bhi user ki public profile (IMPORTANT: "/" ke baad rakho)
router.get("/:id", authenticate, getPublicProfile);

router.post(
    "/upload-image",
    authenticate,
    upload.single("image"),
    uploadProfileImage
);

router.put(
    "/",
    authenticate,
    userValidation,
    validateRequest,
    updateUserProfile
);

export default router;