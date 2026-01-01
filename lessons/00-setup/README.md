# Lesson 00: セットアップと実行の最短経路

## ゴール

- Node.js と npm の役割をざっくり掴む
- `node` で JS を実行できる
- `npm run ...` でレッスンを回せる

## Node / npm は何？（Pythonとの対比）

- Node.js: JavaScript の実行環境（Python でいう `python` 本体）
- npm: パッケージ管理 + スクリプト実行（Python でいう `pip` + `python -m ...` の一部）
- `node_modules/`: プロジェクト内に入る依存パッケージ群（venv の `site-packages` に近い立ち位置）

このリポジトリは依存パッケージ無しでも学べますが、基本動作として `npm install` を1回やっておく想定です。

## 必要バージョン

- Node.js 18 以上

`nvm` を使う場合:

```bash
nvm use
```

確認:

```bash
node -v
npm -v
```

## まず動かす

リポジトリ直下で:

```bash
npm install
npm run lesson:01
```

## ESM（import/export）について

このリポジトリは `package.json` で `"type": "module"` を指定しているため、
Node.js 上で `import` / `export` を標準の書き方で使います。

- 相対パス import は拡張子 `.js` が必要（例: `./math.js`）
- `require()` は使いません（CommonJS ではなく ESM）
