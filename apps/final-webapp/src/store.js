export function createMemoStore() {
  /** @type {Map<number, {id: number, text: string, createdAt: string}>} */
  const memos = new Map();
  let nextId = 1;

  function list() {
    return Array.from(memos.values()).sort((a, b) => a.id - b.id);
  }

  function add(text) {
    const trimmed = String(text ?? "").trim();
    if (!trimmed) {
      const err = new Error("text is required");
      // @ts-ignore
      err.code = "VALIDATION";
      throw err;
    }

    const memo = {
      id: nextId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    memos.set(nextId, memo);
    nextId += 1;
    return memo;
  }

  function remove(id) {
    return memos.delete(id);
  }

  return { list, add, remove };
}
