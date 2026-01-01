# Lesson 04: CLI（引数・標準入力・終了コード）

## ゴール

- `process.argv` で引数を読む
- `stdin` を読む
- `process.exitCode` で終了コードを返す

## 実行例

```bash
npm run lesson:04 -- --help
npm run lesson:04 -- --name Aki --times 3

echo "hello" | npm run lesson:04 -- --stdin
```

`npm run` 経由で引数を渡すときは `--` が必要です（npm の引数とスクリプトの引数を分けるため）。
