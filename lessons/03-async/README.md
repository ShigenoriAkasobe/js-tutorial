# Lesson 03: 非同期（Promise / async-await）

## ゴール

- Promise の基本形（then/catch）
- `async` / `await` の基本形
- `Promise.all` で並行処理
- ファイルI/O（`fs/promises`）

## 実行

```bash
npm run lesson:03
```

## Pythonとの対比

- Python: `async def` / `await` + `asyncio.gather`
- JS: `async function` / `await` + `Promise.all`

トップレベルで `await` が使えるのは、ESM（このリポジトリの設定）だからです。
