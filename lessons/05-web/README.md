# Lesson 05: 最小のHTTPサーバ

## ゴール

- Node標準の `http` でサーバーを立てる
- ルーティング（URLで分岐）
- JSONレスポンス

## 起動

```bash
npm run lesson:05
```

サーバーはフォアグラウンドで動くので、起動したターミナルは「占有」されます。
`curl` は別ターミナルで実行してください（終了は `Ctrl+C`）。

起動すると `server listening on http://localhost:xxxx` と表示されます。
この `xxxx` が実際に使われたポートです（空きポートを自動で選びます）。

起動後（表示されたポートに合わせて実行）:

- ブラウザで `http://localhost:xxxx/` を開く（動作確認用トップページ）

- `curl http://localhost:xxxx/health`
- `curl http://localhost:xxxx/api/time`
- `curl "http://localhost:xxxx/api/echo?msg=hello"`

ポートを固定したい場合は環境変数 `PORT` を使えます:

```bash
PORT=4000 npm run lesson:05
```

## うまくいかないとき

- `curl` が止まって見える: サーバーを起動したターミナルで `curl` を打っていないか確認（基本は別ターミナル）
- `EADDRINUSE`（ポートが使用中）: すでに 3001 番が埋まっています。既存プロセスを止めるか、`server.js` の `port` を変更してください
