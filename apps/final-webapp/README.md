# Final: ミニWebアプリ（メモ）

## できること

- メモの追加
- メモ一覧
- メモ削除

保存先はメモリ上（プロセスが落ちると消えます）。

## 起動

```bash
npm start
```

ブラウザで `http://localhost:3000`。

### うまくいかないとき

- `EADDRINUSE`（ポートが使用中）: 3000 番が使用中です。既存プロセスを止めるか、[apps/final-webapp/server.js](apps/final-webapp/server.js) の `port` を変更してください
- 終了: 起動したターミナルで `Ctrl+C`

## API

- `GET /api/memos`
- `POST /api/memos` body: `{ "text": "..." }`
- `DELETE /api/memos/:id`
