import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createMemoStore } from "./src/store.js";

const store = createMemoStore();

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "public");

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
    if (req.method === "GET" && url.pathname === "/api/memos") {
      return sendJson(res, 200, store.list());
    }

    if (req.method === "POST" && url.pathname === "/api/memos") {
      const raw = await readRequestBody(req);
      const parsed = JSON.parse(raw || "{}");
      const memo = store.add(parsed.text);
      return sendJson(res, 201, memo);
    }

    const memoIdMatch = url.pathname.match(/^\/api\/memos\/(\d+)$/);
    if (req.method === "DELETE" && memoIdMatch) {
      const id = Number(memoIdMatch[1]);
      const ok = store.remove(id);
      if (!ok) return sendJson(res, 404, { error: "not_found" });
      res.writeHead(204);
      res.end();
      return;
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
    if (msg === "text is required") {
      return sendJson(res, 400, { error: "text_required" });
    }
    return sendJson(res, 500, { error: "internal_error" });
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`mini app listening on http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
