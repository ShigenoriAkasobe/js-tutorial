import mathVersion, { add, mul } from "./math.js";

console.log("math module version:", mathVersion);
console.log("add(2, 3) ->", add(2, 3));
console.log("mul(2, 3) ->", mul(2, 3));

// 動的 import（必要なときに読み込む）
const dynamic = await import("./math.js");
console.log("dynamic.add(10, 20) ->", dynamic.add(10, 20));
