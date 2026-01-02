import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "public");

let nextId = 1;
let todos = [
  { id: nextId++, text: "fetchの基本を読む", done: false },
  { id: nextId++, text: "res.ok と例外の扱い", done: false },
];

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function sendJson(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  send(
    res,
    statusCode,
    {
      "content-type": "application/json; charset=utf-8",
      "content-length": Buffer.byteLength(body),
    },
    body
  );
}

async function readRequestBody(req, limitBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > limitBytes) {
        reject(new Error("payload_too_large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", (err) => reject(err));
  });
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

async function serveFile(res, filePath) {
  const body = await readFile(filePath);
  send(
    res,
    200,
    {
      "content-type": contentTypeFor(filePath),
      "content-length": body.length,
    },
    body
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  try {
    // Static
    if (req.method === "GET" && url.pathname === "/") {
      return await serveFile(res, path.join(publicDir, "index.html"));
    }

    if (req.method === "GET" && url.pathname === "/client.js") {
      return await serveFile(res, path.join(publicDir, "client.js"));
    }

    // API
    if (req.method === "GET" && url.pathname === "/api/todos") {
      return sendJson(res, 200, todos);
    }

    if (req.method === "POST" && url.pathname === "/api/todos") {
      const raw = await readRequestBody(req);
      const parsed = JSON.parse(raw || "{}");
      const text = String(parsed.text ?? "").trim();
      if (!text) return sendJson(res, 400, { error: "text_required" });

      const todo = { id: nextId++, text, done: false };
      todos = [todo, ...todos];
      return sendJson(res, 201, todo);
    }

    const patchMatch = url.pathname.match(/^\/api\/todos\/(\d+)$/);
    if (req.method === "PATCH" && patchMatch) {
      const id = Number(patchMatch[1]);
      const raw = await readRequestBody(req);
      const parsed = JSON.parse(raw || "{}");
      if (typeof parsed.done !== "boolean") {
        return sendJson(res, 400, { error: "done_must_be_boolean" });
      }

      const idx = todos.findIndex((t) => t.id === id);
      if (idx === -1) return sendJson(res, 404, { error: "not_found" });

      const updated = { ...todos[idx], done: parsed.done };
      todos = todos.map((t) => (t.id === id ? updated : t));
      return sendJson(res, 200, updated);
    }

    if (req.method === "DELETE" && patchMatch) {
      const id = Number(patchMatch[1]);
      const before = todos.length;
      todos = todos.filter((t) => t.id !== id);
      if (todos.length === before) return sendJson(res, 404, { error: "not_found" });
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/slow") {
      const ms = Number(url.searchParams.get("ms") ?? "1200");
      const wait = Number.isFinite(ms) ? Math.max(0, Math.min(ms, 10_000)) : 1200;
      await sleep(wait);
      return sendJson(res, 200, { ok: true, waitedMs: wait });
    }

    return sendJson(res, 404, { error: "not_found", path: url.pathname });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === "payload_too_large") {
      return sendJson(res, 413, { error: "payload_too_large" });
    }
    if (msg.includes("JSON")) {
      return sendJson(res, 400, { error: "invalid_json" });
    }
    return sendJson(res, 500, { error: "internal_error" });
  }
});

const envPort = process.env.PORT;
const requestedPort = envPort === undefined ? 0 : Number(envPort);
const port = Number.isFinite(requestedPort) && requestedPort >= 0 ? requestedPort : 0;

server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`lesson08 listening on http://localhost:${actualPort}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
