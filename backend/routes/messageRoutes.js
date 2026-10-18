import express from "express";
import {
    sendMessage,
    getConversation,
    getAllUsers,
} from "../controllers/messageController.js";

import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, sendMessage);

// IMPORTANT: /users route ko /:userId se pehle rakho
router.get("/users", authenticate, getAllUsers);

router.get("/:userId", authenticate, getConversation);

export default router;