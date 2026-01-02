# Lesson 07: フロントエンド基礎（フォーム / バリデーション / localStorage）

## ゴール

- `submit` イベントと `FormData` でフォーム値を読む
- HTML標準バリデーション（`required`, `minLength`, `type=email`）と、追加のチェック
- 送信中/エラー表示などのUI状態管理
- `localStorage` で「ブラウザに保存」する

## 起動

```bash
node lessons/07-frontend-forms/server.js
```

起動ログに出るURLをブラウザで開きます。終了は `Ctrl+C`。

## 使う頻出表現

- `new FormData(form)`
- `Object.fromEntries(formData.entries())`
- `form.reportValidity()`（標準バリデーションのエラーポップアップ）
- `localStorage.getItem/setItem`（JSONで保存）
