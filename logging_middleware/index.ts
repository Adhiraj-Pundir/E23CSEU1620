import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type Package = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" | "auth" | "config" | "middleware" | "utils";

const BASE_URL = process.env.BASE_URL || "http://4.224.186.213/evaluation-service";

export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
  try {
    const token = process.env.ACCESS_TOKEN;
    if (!token) { console.error("[Logger] ACCESS_TOKEN not set"); return; }
    await axios.post(`${BASE_URL}/logs`, { stack, level, package: pkg, message }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    console.log(`[${stack.toUpperCase()}][${level.toUpperCase()}][${pkg}] ${message}`);
  } catch (err: any) {
    console.error("[Logger] Failed:", err?.response?.data || err.message);
  }
}
