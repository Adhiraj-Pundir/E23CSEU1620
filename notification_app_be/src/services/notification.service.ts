import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { Log } from "../../../logging_middleware/index";

const BASE_URL = process.env.BASE_URL || "http://4.224.186.213/evaluation-service";
const TYPE_WEIGHT: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };
const headers = () => ({ Authorization: `Bearer ${process.env.ACCESS_TOKEN}` });

export async function fetchAll(page: number, limit: number) {
  await Log("backend", "info", "service", `Fetching notifications page=${page}`);
  const res = await axios.get(`${BASE_URL}/notifications`, { headers: headers() });
  const all = res.data.notifications;
  const start = (page - 1) * limit;
  return { total: all.length, page, limit, data: all.slice(start, start + limit) };
}

export async function getPriority(studentId: string, top: number) {
  await Log("backend", "info", "service", `Priority inbox for ${studentId} top=${top}`);
  const res = await axios.get(`${BASE_URL}/notifications`, { headers: headers() });
  const scored = res.data.notifications.map((n: any) => {
    const ageDays = (Date.now() - new Date(n.Timestamp).getTime()) / 86400000;
    return { ...n, score: (TYPE_WEIGHT[n.Type] ?? 1) * (1 / (1 + ageDays)) };
  });
  return { studentId, top, notifications: scored.sort((a: any, b: any) => b.score - a.score).slice(0, top) };
}
