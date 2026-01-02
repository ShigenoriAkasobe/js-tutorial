function header(title) {
  console.log(`\n=== ${title} ===`);
}

function triple(x) {
  return x * 3;
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
// Examples showing type-coercing == vs strict ===
console.log("0 == false ->", 0 == false);
console.log("'' == 0 ->", '' == 0);
console.log("null == undefined ->", null == undefined);
console.log("NaN === NaN ->", NaN === NaN, "(use Number.isNaN to detect NaN)");

header("Arrays");
const numbers = [1, 2, 3];
numbers.push(4);
const doubled = numbers.map((n) => n * 2);
console.log({ numbers, doubled });
const toripled = numbers.map(triple);
console.log({ toripled });

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

// Differences: hoisting, this-binding, and brevity
// function declarations are hoisted and have their own `this`.
// Arrow functions are shorter and use lexical `this`.
// Example: hoisting
console.log('hoisted add ->', add(1,2));
try {
  console.log('hoisted add2 ->', add2(1,2));
} catch (e) {
  console.log('calling add2 before declaration throws:', e.name);
}

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
console.log(c.value);
console.log(c.inc());
console.log(c.inc());

class AdvancedCounter extends Counter {
  dec() {
    this.value -= 1;
    return this.value;
  }
}

const ac = new AdvancedCounter(20);
console.log(ac.value);
console.log(ac.inc());
console.log(ac.dec());

class PrivateCounter {
  #value;
  constructor(initialValue = 0) {
    this.#value = initialValue;
  }

  inc() {
    this.#value += 1;
    return this.#value;
  }

  getValue() {
    return this.#value;
  }

  setValue(newValue) {
    this.#value = newValue;
  }
}
const pc = new PrivateCounter(30);
// console.log(pc.#value); // Error: Private field '#value' must be declared in an enclosing class
console.log(pc.getValue());
console.log(pc.inc());
pc.setValue(100);
console.log(pc.getValue());

header("Exceptions / try-catch");
try {
  JSON.parse("not json");
} catch (err) {
  console.log("caught:", err instanceof Error ? err.message : err);
}
