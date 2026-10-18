import express from "express";
import {
    createSupportRequest,
    getMySupportRequests,
    getMySupportRequestById,
} from "../controllers/supportController.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, createSupportRequest);
router.get("/", authenticate, getMySupportRequests);
router.get("/:id", authenticate, getMySupportRequestById);

export default router;