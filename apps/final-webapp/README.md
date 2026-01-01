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

## API

- `GET /api/memos`
- `POST /api/memos` body: `{ "text": "..." }`
- `DELETE /api/memos/:id`
