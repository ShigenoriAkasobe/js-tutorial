# Lesson 06: フロントエンド基礎（DOM / イベント / 再描画）

## ゴール

- DOM の取得（`querySelector`）と更新（`textContent`/`appendChild`）
- イベント（`addEventListener`）とフォーム送信（`submit` + `preventDefault`）
- 「状態（state）→ 描画（render）」の基本パターン
- よく使う表現: `closest` / `dataset` / イベントデリゲーション

## 起動

```bash
node lessons/06-frontend-dom/server.js
```

起動ログに出るURL（例: `http://localhost:4321`）をブラウザで開きます。
終了は `Ctrl+C`。

## 見どころ

- `state` はJSの普通のオブジェクト/配列でOK
- UI更新は「DOMを直接いじる」より、`render()` でまとめて更新すると追いやすい
- リストの削除は、各ボタンにイベントを付けるより
  親要素1箇所で受ける（イベントデリゲーション）と実装がラク

## FastAPI + JS の読み解きに役立つ観点

- フロントは基本「ユーザー操作 → state更新 → render」で回る
- FastAPIと繋ぐときは `fetch` の部分がAPI呼び出しに置き換わる（lesson08で扱います）
