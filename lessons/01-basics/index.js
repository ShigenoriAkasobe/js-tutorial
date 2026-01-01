function header(title) {
  console.log(`\n=== ${title} ===`);
}

header("Variables");
const pi = 3.14159;
let counter = 0;
counter += 1;
console.log({ pi, counter });

header("Types / null / undefined");
let x;
const y = null;
console.log({ x, y, typeofX: typeof x, typeofY: typeof y });

header("Equality");
console.log("1 == '1' ->", 1 == "1");
console.log("1 === '1' ->", 1 === "1");

header("Arrays");
const numbers = [1, 2, 3];
numbers.push(4);
const doubled = numbers.map((n) => n * 2);
console.log({ numbers, doubled });

header("Objects (like dict)");
const user = {
  id: 1,
  name: "Aki",
  greet() {
    return `Hello, ${this.name}`;
  },
};
console.log(user.greet());

header("Destructuring");
const { id, name } = user;
const [first, second] = numbers;
console.log({ id, name, first, second });

header("Functions");
function add(a, b) {
  return a + b;
}
const add2 = (a, b) => a + b;
console.log({ add: add(2, 3), add2: add2(2, 3) });

header("Class (Pythonのclassに近い形)");
class Counter {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }

  inc() {
    this.value += 1;
    return this.value;
  }
}

const c = new Counter(10);
console.log(c.inc());
console.log(c.inc());

header("Exceptions / try-catch");
try {
  JSON.parse("not json");
} catch (err) {
  console.log("caught:", err instanceof Error ? err.message : err);
}
