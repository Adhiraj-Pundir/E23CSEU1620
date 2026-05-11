import express from "express";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import { Log } from "../../logging_middleware/index";
import notificationRoutes from "./routes/notification.routes";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/notifications", notificationRoutes);
app.get("/health", async (req, res) => {
  await Log("backend", "info", "route", "Health check");
  res.json({ status: "ok" });
});
app.listen(PORT, async () => {
  await Log("backend", "info", "handler", `Server running on port ${PORT}`);
  console.log(`Server on http://localhost:${PORT}`);
});
