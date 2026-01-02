# Lesson 03: 非同期（Promise / async-await）

## ゴール

- Promise の基本形（then/catch）
- `async` / `await` の基本形
- 逐次処理と並行処理（`await` vs `Promise.all`）
- 失敗時の扱い（`Promise.all` / `Promise.allSettled`）
- タイムアウト（`Promise.race`）
- ファイルI/O（`fs/promises`）

このレッスンは Node.js（このリポジトリは `type: module`）を前提に、**「Promise を読める/書ける」→「async/await で安全に扱える」** までを狙います。

## 実行

```bash
npm run lesson:03
```

## まず押さえること

### Promise とは

- Promise は「未来に完了する処理」の入れ物
- 状態は3つ: `pending`（未完了） / `fulfilled`（成功） / `rejected`（失敗）
- `then` は成功時、`catch` は失敗時の処理をつなげる

### async/await とは

- `async function` は **必ず Promise を返す**（返り値は自動的に Promise で包まれる）
- `await` は Promise の完了を待つ（成功なら値、失敗なら例外を投げる）
- `try/catch` は **同期例外も、`await` で待った非同期の失敗も** 捕まえられる

## 代表パターン

### 逐次（sequential）: 1つずつ待つ

```js
const a = await job("A", 200);
const b = await job("B", 300);
// 合計はだいたい 500ms
```

### 並行（parallel）: Promise を先に作ってまとめて待つ

```js
const results = await Promise.all([job("A", 200), job("B", 300)]);
// 合計はだいたい max(200,300)=300ms
```

ポイント: `await job()` を2回書くと逐次になりがち。**「Promiseを配列に詰めてから await」** すると並行になります。

### Promise.all: どれか1つでも失敗したら全体が失敗

- `Promise.all([...])` は、配列内のどれかが `reject` した瞬間に `reject` する
- ただし「他の処理が中断される」とは限らない（すでに走っていれば走り続ける）

### Promise.allSettled: 成功/失敗を両方回収する

- API の複数呼び出しなどで「失敗も含めて結果を全部集めたい」場合に便利

### Promise.race: 先に決着したものを採用する（タイムアウトに使える）

```js
await Promise.race([
	slowOperation(),
	timeout(250),
]);
```

## ファイルI/O（fs/promises）

このレッスンでは JSON を読み込んで `JSON.parse` します。

```js
import { readFile } from "node:fs/promises";

const raw = await readFile(new URL("./data/users.json", import.meta.url), "utf-8");
const users = JSON.parse(raw);
```

`new URL(..., import.meta.url)` を使うと、実行時のカレントディレクトリに依存せず、**このファイルからの相対パス**で安全に参照できます。

## Pythonとの対比

- Python: `async def` / `await` + `asyncio.gather`
- JS: `async function` / `await` + `Promise.all`

トップレベルで `await` が使えるのは、ESM（このリポジトリの設定）だからです。

## 出力例（雰囲気）

環境により時間は前後しますが、概ね以下の流れになります。

- file I/O で users が表示される
- 逐次は約 500ms、並行は約 300ms
- `Promise.all` の失敗が `try/catch` で捕まる
- `allSettled` は `fulfilled/rejected` が混ざった配列になる
- タイムアウトが例外として捕まる

## 演習（手を動かす）

1. `job("C", 100)` を追加して、逐次/並行の時間がどう変わるか観察する
2. `Promise.all` の配列内で失敗する位置（先/後）を変えて、どのタイミングで `catch` に入るか確認する
3. `withTimeout(job("slow", 400), 250)` の数値を変えて、成功/失敗を切り替えてみる

（ヒント）「Promise を作るタイミング」と「await するタイミング」を意識すると、並行/逐次の違いが掴みやすいです。
