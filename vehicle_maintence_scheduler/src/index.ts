import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();
import { Log } from "../../logging_middleware/index";

const BASE_URL = process.env.BASE_URL || "http://4.224.186.213/evaluation-service";
const headers = () => ({ Authorization: `Bearer ${process.env.ACCESS_TOKEN}` });

interface Depot { ID: number; MechanicHours: number; }
interface Vehicle { TaskID: string; Duration: number; Impact: number; }

function knapsack(vehicles: Vehicle[], capacity: number) {
  const n = vehicles.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const v = vehicles[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (v.Duration <= w) dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - v.Duration] + v.Impact);
    }
  }
  const selected: Vehicle[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { selected.push(vehicles[i - 1]); w -= vehicles[i - 1].Duration; }
  }
  return { selected, totalImpact: dp[n][capacity] };
}

async function main() {
  await Log("backend", "info", "handler", "Vehicle Maintenance Scheduler starting");
  const depots: Depot[] = (await axios.get(`${BASE_URL}/depots`, { headers: headers() })).data.depots;
  const vehicles: Vehicle[] = (await axios.get(`${BASE_URL}/vehicles`, { headers: headers() })).data.vehicles;
  await Log("backend", "debug", "service", `Fetched ${depots.length} depots, ${vehicles.length} vehicles`);

  for (const depot of depots) {
    const { selected, totalImpact } = knapsack(vehicles, depot.MechanicHours);
    await Log("backend", "info", "service", `Depot ${depot.ID}: impact=${totalImpact}, tasks=${selected.length}`);
    console.log(`\nDepot ${depot.ID} (${depot.MechanicHours}h) => Impact: ${totalImpact}`);
    console.log(JSON.stringify(selected, null, 2));
  }
  await Log("backend", "info", "handler", "Scheduler completed");
}

main().catch(console.error);
