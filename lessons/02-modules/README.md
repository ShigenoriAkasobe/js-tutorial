# Lesson 02: モジュール（import/export）

## ゴール

- `export` / `import`（ESM）の基本
- 名前付きexport / default export
- 相対パスimportは拡張子 `.js` が必要

## 実行

```bash
npm run lesson:02
```

## Pythonとの対比

- Python: `from pkg.mod import func`
- JS(ESM): `import { func } from './mod.js'`

JS はファイルが基本単位なので、まずは「ファイル間で関数を出し入れする」感覚を固めるのが近道です。

## ESモジュール (import / export) の簡単な説明

- **デフォルトエクスポート (default export)**: ファイルごとに1つだけの代表エクスポート。波括弧なしで好きな名前で受け取れる。
    - 例: `export default mathVersion;` を受け取るときは `import mathVersion from "./math.js";`

- **名前付きエクスポート (named export)**: 複数定義でき、受け取る側は正確な名前を波括弧で指定する。
    - 例: `export function add(a,b) {}` を受け取るときは `import { add } from "./math.js";`

- **両方同時**に受け取ることもできる:
    - 例: `import mathVersion, { add, mul } from "./math.js";` (default + named)

- **ネームスペース取り込み**: ファイルの全エクスポートをオブジェクトにまとめる。
    - 例: `import * as math from "./math.js";` -> `math.add(2,3)` のように使える。

- **その他**: `import` は静的解析されるため名前が厳密に一致する必要があり、インポートしたバインディングは再代入できません（ただしエクスポート側の更新は反映されるライブバインディングという挙動があります）。
