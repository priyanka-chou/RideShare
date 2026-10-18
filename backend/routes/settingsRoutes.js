
import express from "express";

import {
    getNotificationSettings,
    updateNotificationSettings,
} from "../controllers/settingsController.js";

import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.get(
    "/notifications",
    authenticate,
    getNotificationSettings
);

router.put(
    "/notifications",
    authenticate,
    updateNotificationSettings
);

export default router;
