function usage() {
  console.log(`Usage:
  node lessons/04-cli/cli.js [--name <name>] [--times <n>] [--stdin]

Examples:
  npm run lesson:04 -- --name Aki --times 3
  echo "hello" | npm run lesson:04 -- --stdin
`);
}

function getArgValue(args, key) {
  const eq = args.find((a) => a.startsWith(`${key}=`));
  if (eq) return eq.slice(key.length + 1);

  const idx = args.indexOf(key);
  if (idx >= 0) return args[idx + 1];

  return undefined;
}

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");

    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", (err) => reject(err));
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    usage();
    return;
  }

  const name = getArgValue(args, "--name") ?? "world";
  const timesRaw = getArgValue(args, "--times") ?? "1";
  const times = Number(timesRaw);

  if (!Number.isInteger(times) || times < 1 || times > 20) {
    console.error("--times must be an integer between 1 and 20");
    process.exitCode = 2;
    return;
  }

  const useStdin = args.includes("--stdin");
  const stdinText = useStdin ? (await readStdin()).trimEnd() : null;

  for (let i = 0; i < times; i += 1) {
    const suffix = stdinText ? ` (stdin: ${stdinText})` : "";
    console.log(`hello, ${name}! #${i + 1}${suffix}`);
  }
}

await main();
