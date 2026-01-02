const $ = (selector, root = document) => root.querySelector(selector);

const STORAGE_KEY = "lesson07.profile.v1";

function setStatus(text) {
  $("#status").textContent = text;
}

function readStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function validate(profile) {
  // HTML標準のrequired/emailに加えて、追加でチェックしたい時の例
  if (profile.displayName && profile.displayName.toLowerCase().includes("admin")) {
    return "表示名に 'admin' は使えません";
  }
  if (profile.age !== "" && profile.age !== undefined && profile.age !== null) {
    const age = Number(profile.age);
    if (!Number.isFinite(age)) return "年齢が不正です";
    if (age < 0 || age > 130) return "年齢は 0〜130 の範囲で入力してください";
  }
  return null;
}

function renderPreview(profile) {
  const p = profile ?? {};
  const lines = [
    `表示名: ${p.displayName ?? ""}`,
    `メール: ${p.email ?? ""}`,
    `年齢: ${p.age ?? ""}`,
    `ニュースレター: ${p.newsletter ? "受け取る" : "受け取らない"}`,
    `自己紹介: ${p.bio ?? ""}`,
  ];

  const box = $("#preview");
  box.textContent = "";
  const pre = document.createElement("pre");
  pre.textContent = lines.join("\n");
  box.appendChild(pre);
}

function formToProfile(form) {
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());

  // checkbox は entries() に出ないことがあるので明示
  obj.newsletter = fd.get("newsletter") === "on";

  return obj;
}

function fillForm(form, profile) {
  form.displayName.value = profile.displayName ?? "";
  form.email.value = profile.email ?? "";
  form.age.value = profile.age ?? "";
  form.bio.value = profile.bio ?? "";
  form.newsletter.checked = Boolean(profile.newsletter);
}

function setSaving(isSaving) {
  $("#save").disabled = isSaving;
  $("#reset").disabled = isSaving;
}

const form = $("#form");

// 初期ロード
const saved = readStorage();
if (saved) {
  fillForm(form, saved);
  renderPreview(saved);
  setStatus("保存データを読み込みました");
} else {
  renderPreview(formToProfile(form));
}

// 入力のたびにプレビュー更新（よくあるパターン）
form.addEventListener("input", () => {
  renderPreview(formToProfile(form));
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // HTML標準のバリデーションを走らせる
  if (!form.reportValidity()) return;

  const profile = formToProfile(form);
  const extraError = validate(profile);
  if (extraError) {
    setStatus(extraError);
    return;
  }

  setSaving(true);
  setStatus("保存中...");

  try {
    // 本来はここが fetch('/api/...') になる（lesson08）
    await new Promise((r) => setTimeout(r, 300));

    writeStorage(profile);
    setStatus("保存しました（localStorage）");
    renderPreview(profile);
  } finally {
    setSaving(false);
  }
});

$("#reset").addEventListener("click", () => {
  clearStorage();
  form.reset();
  renderPreview(formToProfile(form));
  setStatus("保存データを消しました");
});
