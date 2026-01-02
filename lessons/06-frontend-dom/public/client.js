const $ = (selector, root = document) => root.querySelector(selector);

const state = {
  count: 0,
  nextId: 1,
  tasks: [], // { id: number, text: string, done: boolean }
};

function renderCounter() {
  $("#count").textContent = String(state.count);
}

function taskLi(task) {
  const li = document.createElement("li");
  li.dataset.id = String(task.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.dataset.action = "toggle";

  const text = document.createElement("span");
  text.textContent = task.text;

  if (task.done) {
    text.style.textDecoration = "line-through";
  }

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "削除";
  del.dataset.action = "delete";

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(text);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(del);

  return li;
}

function renderTasks() {
  const list = $("#list");
  list.textContent = "";

  for (const task of state.tasks) {
    list.appendChild(taskLi(task));
  }
}

function render() {
  renderCounter();
  renderTasks();
}

// --- Counter ---
$("#inc").addEventListener("click", () => {
  state.count += 1;
  renderCounter();
});

$("#dec").addEventListener("click", () => {
  state.count -= 1;
  renderCounter();
});

// --- Tasks: 追加 ---
$("#form").addEventListener("submit", (e) => {
  e.preventDefault();

  const input = $("#text");
  const text = input.value.trim();
  if (!text) return;

  state.tasks.unshift({ id: state.nextId++, text, done: false });
  input.value = "";
  renderTasks();
});

// --- Tasks: リスト上の操作（イベントデリゲーション） ---
$("#list").addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  if (!action) return;

  const li = target.closest("li");
  if (!li) return;

  const idRaw = li.dataset.id;
  const id = idRaw ? Number(idRaw) : NaN;
  if (!Number.isFinite(id)) return;

  if (action === "delete") {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    renderTasks();
    return;
  }

  if (action === "toggle") {
    state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    renderTasks();
  }
});

// checkbox は click だけだとズレることがあるので change も見る
$("#list").addEventListener("change", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.action !== "toggle") return;

  const li = target.closest("li");
  if (!li) return;

  const idRaw = li.dataset.id;
  const id = idRaw ? Number(idRaw) : NaN;
  if (!Number.isFinite(id)) return;

  state.tasks = state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  renderTasks();
});

$("#clearDone").addEventListener("click", () => {
  state.tasks = state.tasks.filter((t) => !t.done);
  renderTasks();
});

render();
