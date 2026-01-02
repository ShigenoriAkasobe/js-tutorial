# Lesson 08: フロントエンド基礎（fetch / JSON / エラーハンドリング）

## ゴール

- `fetch` で JSON API を叩く（GET/POST/PATCH/DELETE）
- `res.ok` と `try/catch` によるエラーハンドリング
- `AbortController` でリクエストをキャンセルする
- 「ローディング中」「エラー」「成功」をUIに反映する

このlessonは、フロントが `fetch` で同一オリジンのAPIを呼ぶ形にしてあります。
FastAPI（別ポート）に繋ぐときは、CORSやプロキシの話が追加で必要になることがあります。

## 起動

```bash
node lessons/08-frontend-fetch/server.js
```

起動ログに出るURLをブラウザで開きます。終了は `Ctrl+C`。

## API（このlessonのNodeサーバが提供）

- `GET /api/todos`
- `POST /api/todos` body: `{ "text": "..." }`
- `PATCH /api/todos/:id` body: `{ "done": true/false }`
- `DELETE /api/todos/:id`
- `GET /api/slow?ms=...`（キャンセルの練習用）

## FastAPI + JS の読み解きメモ

- `fetch("/api/..." )` は同一オリジン前提（同じホスト/ポート）
- FastAPI が `http://localhost:8000`、フロントが `http://localhost:3000` のように分かれると
  - FastAPI 側で CORS 設定が必要、または
  - フロント側でAPIベースURLを切り替える必要が出ます
