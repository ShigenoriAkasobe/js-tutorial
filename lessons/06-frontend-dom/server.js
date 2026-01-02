import http from "node:http";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

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

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      return await serveFile(res, path.join(publicDir, "index.html"));
    }

    if (req.method === "GET" && url.pathname === "/client.js") {
      return await serveFile(res, path.join(publicDir, "client.js"));
    }

    return sendJson(res, 404, { error: "not_found", path: url.pathname });
  } catch (err) {
    return sendJson(res, 500, { error: "internal_error" });
  }
});

const envPort = process.env.PORT;
const requestedPort = envPort === undefined ? 0 : Number(envPort);
const port = Number.isFinite(requestedPort) && requestedPort >= 0 ? requestedPort : 0;

server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`lesson06 listening on http://localhost:${actualPort}`);
});

process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
