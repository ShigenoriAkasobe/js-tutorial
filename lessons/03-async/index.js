import { readFile } from "node:fs/promises";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function busy(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

function section(title) {
  console.log(`\n=== ${title} ===`);
}

function job(name, ms, { fail = false } = {}) {
  return sleep(ms).then(() => {
    if (fail) throw new Error(`${name} failed`);
    return name;
  });
}

function job_busy(name, ms, {fail = false} = {}) {
  return Promise.resolve()
    .then( () => {
      busy(ms);
      if (fail) throw new Error(`${name} failed`);
      return name;
    });
}

async function withTimeout(promise, ms, label = "operation") {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function readUsers() {
  const raw = await readFile(new URL("./data/users.json", import.meta.url), "utf-8");
  return JSON.parse(raw);
}

async function main() {
  section("async/await (file I/O)");
  const users = await readUsers();
  console.log("users:", users);

  section("Promise.then/catch");
  await sleep(100)
    .then(() => "slept 100ms")
    .then((msg) => {
      console.log(msg);
      return msg.length;
    })
    .then((len) => {
      console.log("message length:", len);
      return Promise.resolve(len * 2);  // 明示的に Promise を返す。冗長に書くとこうなる。
    })
    .then((doubled) => {
      console.log("doubled length:", doubled);
    })
    .catch((err) => {
      console.error("unexpected:", err);
    });

  section("逐次 vs 並行 (await vs Promise.all)");
  {
    const startedAt = Date.now();
    const a = await job("A", 200);
    const b = await job("B", 300);
    console.log("sequential:", [a, b], "elapsed(ms):", Date.now() - startedAt);
  }
  {
    const startedAt = Date.now();
    const results = await Promise.all([job("A", 200), job("B", 300)]);
    console.log("parallel:", results, "elapsed(ms):", Date.now() - startedAt);
  }

  section("並行処理≠並列処理")
  {
    const startedAt = Date.now();
    const results = await Promise.all([
      job_busy("A", 200),
      job_busy("B", 300),
    ]);
    console.log("concurrent but not parallel:", results, "elapsed(ms):", Date.now() - startedAt
    );
  }

  section("Promise.all の失敗 (reject)");
  try {
    await Promise.all([job("OK", 200), job("NG", 150, { fail: true })]);
  } catch (err) {
    console.log("caught:", err instanceof Error ? err.message : err);
  }

  section("Promise.allSettled (成功/失敗どちらも回収)");
  const settled = await Promise.allSettled([job("OK", 80), job("NG", 50, { fail: true })]);
  console.log("settled:", settled);

  section("タイムアウト (Promise.race)");
  try {
    await withTimeout(job("slow", 400), 250, "slow job");
  } catch (err) {
    console.log("caught:", err instanceof Error ? err.message : err);
  }

  section("try/catch (同期例外/非同期例外)");
  try {
    JSON.parse("not json");
  } catch (err) {
    console.log("caught:", err instanceof Error ? err.message : err);
  }

  try {
    await job("FAIL", 10, { fail: true });
  } catch (err) {
    console.log("caught:", err instanceof Error ? err.message : err);
  }
}

await main();
