import { readFile } from "node:fs/promises";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readUsers() {
  const raw = await readFile(new URL("./data/users.json", import.meta.url), "utf-8");
  return JSON.parse(raw);
}

async function main() {
  console.log("=== async/await ===");
  const users = await readUsers();
  console.log("users:", users);

  console.log("\n=== Promise.then/catch ===");
  sleep(100)
    .then(() => {
      console.log("slept 100ms");
    })
    .catch((err) => {
      console.error("unexpected:", err);
    });

  console.log("\n=== Promise.all (並行) ===");
  const startedAt = Date.now();
  const results = await Promise.all([
    (async () => {
      await sleep(200);
      return "A";
    })(),
    (async () => {
      await sleep(300);
      return "B";
    })(),
  ]);
  console.log("results:", results, "elapsed(ms):", Date.now() - startedAt);

  console.log("\n=== try/catch ===");
  try {
    JSON.parse("not json");
  } catch (err) {
    console.log("caught:", err instanceof Error ? err.message : err);
  }
}

await main();
