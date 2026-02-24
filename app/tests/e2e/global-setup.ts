import { execSync } from "child_process";

const PROJECT_ROOT = process.cwd().replace(/\/app$/, "");
const COMPOSE = "docker compose --profile test";
const TEST_URL = "http://localhost:3001";

function run(cmd: string) {
  execSync(cmd, { cwd: PROJECT_ROOT, stdio: "inherit" });
}

function waitForApp(url: string, timeoutMs = 60_000, intervalMs = 2_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = execSync(`curl -sf ${url}`, { stdio: "pipe" });
      if (res) return;
    } catch {
      // not ready yet
    }
    execSync(`sleep ${intervalMs / 1_000}`);
  }
  throw new Error(`App at ${url} did not become ready within ${timeoutMs}ms`);
}

/**
 * Starts test containers, resets the test database, and waits for the app.
 * Dev database is never touched.
 */
export default function globalSetup() {
  console.log("\n🔄 Starting test containers...");
  run(`${COMPOSE} up -d --wait`);

  console.log("🔄 Resetting test database...");
  run(`${COMPOSE} exec app-test npx prisma migrate reset --force`);

  console.log("⏳ Waiting for test app to be ready...");
  waitForApp(TEST_URL);

  console.log("✅ Test environment ready.\n");
}
