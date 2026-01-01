import http from "node:http";

function sendJson(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "content-length": Buffer.byteLength(text),
  });
  res.end(text);
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, {
    "content-type": "text/html; charset=utf-8",
    "content-length": Buffer.byteLength(html),
  });
  res.end(html);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/") {
    const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lesson 05 Server</title>
  </head>
  <body>
    <h1>Lesson 05: 最小のHTTPサーバ</h1>
    <p>このページは動作確認用のトップページです。</p>
    <ul>
      <li><a href="/health">/health</a>（text）</li>
      <li><a href="/api/time">/api/time</a>（json）</li>
      <li><a href="/api/echo?msg=hello">/api/echo?msg=hello</a>（json）</li>
    </ul>
    <p>このサーバーは <code>${url.origin}</code> で動いています。</p>
  </body>
</html>`;
    return sendHtml(res, 200, html);
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return sendText(res, 200, "ok\n");
  }

  if (req.method === "GET" && url.pathname === "/api/time") {
    return sendJson(res, 200, { now: new Date().toISOString() });
  }

  if (req.method === "GET" && url.pathname === "/api/echo") {
    const msg = url.searchParams.get("msg") ?? "";
    return sendJson(res, 200, { msg });
  }

  return sendJson(res, 404, { error: "not_found", path: url.pathname });
});

server.on("error", (err) => {
  // よくあるのは EADDRINUSE（ポート競合）
  console.error("server error:", err);
  process.exitCode = 1;
});

const envPort = process.env.PORT;
const requestedPort = envPort === undefined ? 0 : Number(envPort);
const port = Number.isFinite(requestedPort) && requestedPort >= 0 ? requestedPort : 0;

// port=0 を指定すると、OS が空いているポートを自動で割り当てる
server.listen(port, () => {
  const address = server.address();
  const actualPort = typeof address === "object" && address ? address.port : port;
  console.log(`server listening on http://localhost:${actualPort}`);
});

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\nreceived ${signal}, shutting down...`);

  // close() が詰まったときに備えて、タイムアウトも用意
  const timer = setTimeout(() => {
    process.exit(1);
  }, 2000);
  timer.unref();

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
