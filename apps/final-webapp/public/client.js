async function api(path, options) {
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

function memoLi(memo, onDelete) {
  const li = document.createElement("li");

  const text = document.createElement("span");
  text.textContent = `${memo.id}: ${memo.text}`;

  const btn = document.createElement("button");
  btn.textContent = "削除";
  btn.addEventListener("click", () => onDelete(memo.id));

  li.appendChild(text);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(btn);

  return li;
}

async function refresh() {
  const listEl = document.getElementById("list");
  listEl.textContent = "";

  const memos = await api("/api/memos", { method: "GET" });
  for (const memo of memos) {
    listEl.appendChild(
      memoLi(memo, async (id) => {
        await api(`/api/memos/${id}`, { method: "DELETE" });
        await refresh();
      })
    );
  }
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = document.getElementById("text");
  const text = input.value;

  await api("/api/memos", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

  input.value = "";
  await refresh();
});

await refresh();
