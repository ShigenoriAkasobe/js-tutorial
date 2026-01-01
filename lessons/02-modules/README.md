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
