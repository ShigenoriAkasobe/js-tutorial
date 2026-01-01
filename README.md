## このリポジトリについて

Pythonユーザーが、Node.js + JavaScript を「書いて動かして」理解できるようにしたチュートリアルです。
レッスンはテーマ別に分割してあり、最終的にミニWebアプリとして組み上げます。

## 前提

- Node.js 18 以上（Node 18 から `fetch` が標準で使えるため）

`nvm` を使っている場合は、リポジトリ直下で以下。

```bash
nvm use
```

## Pythonとの対応（ざっくり）

- Pythonの実行環境（venv）: Node は通常「1つの Node 実行ファイル」を使い回し、プロジェクト単位で依存関係（`node_modules/`）を切り替える感覚です
- `pip install -r requirements.txt`: `npm install`（依存が無くても、基本の習慣として実行してOK）
- `python -m ...` / `python script.py`: `node file.js`
- `__init__.py` や import: JS は `import ... from ...`（このリポジトリは ESM を採用し、`package.json` に `"type": "module"` を設定しています）

## 使い方

最初に一度だけ:

```bash
npm install
```

レッスン実行:

```bash
npm run lesson:01
npm run lesson:02
npm run lesson:03
npm run lesson:04 -- --help
```

Web（レッスン/最終アプリ）はサーバーが起動するので、別ターミナルで `curl` するか、ブラウザでアクセスします。

## レッスン一覧

- Lesson 00: セットアップと実行の最短経路（[lessons/00-setup/README.md](lessons/00-setup/README.md)）
- Lesson 01: 文法とデータ構造（[lessons/01-basics/README.md](lessons/01-basics/README.md)）
- Lesson 02: モジュール（import/export）（[lessons/02-modules/README.md](lessons/02-modules/README.md)）
- Lesson 03: 非同期（Promise/async/await）（[lessons/03-async/README.md](lessons/03-async/README.md)）
- Lesson 04: CLI（引数・標準入力・終了コード）（[lessons/04-cli/README.md](lessons/04-cli/README.md)）
- Lesson 05: 最小のHTTPサーバ（[lessons/05-web/README.md](lessons/05-web/README.md)）

## 最終ミニWebアプリ

メモの追加/一覧/削除ができる最小構成（インメモリ保存）です。

```bash
npm start
```

ブラウザで `http://localhost:3000` を開きます。

詳細（API/トラブルシュート）は [apps/final-webapp/README.md](apps/final-webapp/README.md) を参照してください。
