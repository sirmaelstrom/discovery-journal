const fs = require("fs");
const { spawnSync } = require("child_process");

if (!fs.existsSync(".git")) {
  process.stdout.write("Skipping husky install: .git directory not found.\n");
  process.exit(0);
}

const result = spawnSync("npx", ["husky"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status || 0);
