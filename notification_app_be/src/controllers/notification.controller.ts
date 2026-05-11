import { Request, Response } from "express";
import { Log } from "../../../logging_middleware/index";
import * as Service from "../services/notification.service";

export async function getNotifications(req: Request, res: Response) {
  try {
    await Log("backend", "info", "controller", "GET /notifications");
    const { page = 1, limit = 20 } = req.query;
    res.json(await Service.fetchAll(Number(page), Number(limit)));
  } catch (err: any) {
    await Log("backend", "error", "controller", `getNotifications failed: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}

export async function getPriorityInbox(req: Request, res: Response) {
  try {
    const { studentId } = req.params;
    const top = Number(req.query.top) || 10;
    await Log("backend", "info", "controller", `GET priority inbox studentId=${studentId} top=${top}`);
    res.json(await Service.getPriority(studentId, top));
  } catch (err: any) {
    await Log("backend", "error", "controller", `getPriorityInbox failed: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
}
