const $ = (selector, root = document) => root.querySelector(selector);

function setInfo(text) {
  $("#info").textContent = text;
}

function setError(text) {
  $("#error").textContent = text;
}

function setBusy(isBusy) {
  $("#add").disabled = isBusy;
  $("#reload").disabled = isBusy;
  $("#text").disabled = isBusy;
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? `HTTP ${res.status}`);
  }
  return data;
}

function todoLi(todo) {
  const li = document.createElement("li");
  li.dataset.id = String(todo.id);

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = todo.done;
  cb.dataset.action = "toggle";

  const text = document.createElement("span");
  text.textContent = todo.text;
  if (todo.done) text.style.textDecoration = "line-through";

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "削除";
  del.dataset.action = "delete";

  li.appendChild(cb);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(text);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(del);
  return li;
}

async function refresh() {
  setError("");
  setInfo("読み込み中...");
  setBusy(true);

  try {
    const listEl = $("#list");
    listEl.textContent = "";

    const todos = await api("/api/todos", { method: "GET" });
    for (const todo of todos) {
      listEl.appendChild(todoLi(todo));
    }

    setInfo(`件数: ${todos.length}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(`エラー: ${msg}`);
    setInfo("");
  } finally {
    setBusy(false);
  }
}

$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = $("#text");
  const text = input.value.trim();
  if (!text) return;

  setError("");
  setInfo("追加中...");
  setBusy(true);

  try {
    await api("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text }),
    });

    input.value = "";
    await refresh();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(`エラー: ${msg}`);
    setInfo("");
    setBusy(false);
  }
});

$("#reload").addEventListener("click", refresh);

// リスト操作（イベントデリゲーション）
$("#list").addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  if (!action) return;

  const li = target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  if (!Number.isFinite(id)) return;

  setError("");
  setInfo("更新中...");

  try {
    if (action === "delete") {
      await api(`/api/todos/${id}`, { method: "DELETE" });
      await refresh();
      return;
    }

    if (action === "toggle") {
      // 現在の表示状態から反転（サーバが真実源）
      const nowChecked = target instanceof HTMLInputElement ? target.checked : false;
      await api(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: nowChecked }),
      });
      await refresh();
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(`エラー: ${msg}`);
    setInfo("");
  }
});

// --- AbortController demo ---
let slowController = null;

$("#slowStart").addEventListener("click", async () => {
  setError("");
  $("#slowResult").textContent = "開始...";

  slowController?.abort();
  slowController = new AbortController();

  try {
    const res = await fetch("/api/slow?ms=3000", { signal: slowController.signal });
    const data = await res.json();
    $("#slowResult").textContent = `完了: waitedMs=${data.waitedMs}`;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      $("#slowResult").textContent = "キャンセルしました";
      return;
    }
    const msg = err instanceof Error ? err.message : String(err);
    $("#slowResult").textContent = `失敗: ${msg}`;
  } finally {
    slowController = null;
  }
});

$("#slowCancel").addEventListener("click", () => {
  slowController?.abort();
});

await refresh();
