import { Router } from "express";
import { getNotifications, getPriorityInbox } from "../controllers/notification.controller";
const router = Router();
router.get("/", getNotifications);
router.get("/priority/:studentId", getPriorityInbox);
export default router;
