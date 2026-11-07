#!/usr/bin/env node
/**
 * Test runner for Smart Campus Room Catalog.
 * Runs the Python test suite using the standalone runner (no unittest/signal needed).
 *
 * Usage:  node run_tests.cjs
 */
const { spawnSync } = require("child_process");
const path = require("path");

const scriptDir = __dirname;
const srcDir = path.join(scriptDir, "src");

const candidates = ["python3", "python3.11", "python3.12", "python3.10", "python"];

for (const py of candidates) {
  const check = spawnSync(py, ["--version"], { stdio: "pipe" });
  if (check.status === 0) {
    const env = { ...process.env, PYTHONPATH: srcDir };
    const result = spawnSync(py, ["run_tests_standalone.py"], {
      cwd: scriptDir,
      env,
      stdio: "inherit",
    });
    process.exit(result.status ?? 1);
  }
}

console.error("No Python interpreter found. Install Python 3 to run tests.");
process.exit(1);