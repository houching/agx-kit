import { test } from "bun:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fse from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");

const read = (relativePath) => fse.readFile(path.join(repoRoot, relativePath), "utf8");
const readJson = (relativePath) => fse.readJson(path.join(repoRoot, relativePath));

test("all GitHub Actions are pinned to immutable commit SHAs", async () => {
    const workflowDir = path.join(repoRoot, ".github", "workflows");
    const workflowFiles = (await fse.readdir(workflowDir))
        .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"));
    const unpinned = [];

    for (const workflowFile of workflowFiles) {
        const lines = (await read(path.join(".github", "workflows", workflowFile))).split("\n");
        for (const [index, line] of lines.entries()) {
            const match = line.match(/uses:\s*[^@\s]+@([^\s#]+)/);
            if (match && !/^[0-9a-f]{40}$/.test(match[1])) {
                unpinned.push(`${workflowFile}:${index + 1}:${match[1]}`);
            }
        }
    }

    assert.deepEqual(unpinned, []);
});

test("release workflows do not disable TLS or use a long-lived npm token", async () => {
    const publish = await read(".github/workflows/publish.yml");

    assert.doesNotMatch(publish, /NODE_TLS_REJECT_UNAUTHORIZED/);
    assert.doesNotMatch(publish, /NPM_TOKEN|NODE_AUTH_TOKEN/);
    assert.match(publish, /id-token:\s*write/);
    assert.match(publish, /Trusted Publishing/);
});

test("release versions stay aligned across packages, locks, and toolkit", async () => {
    const manifests = await Promise.all([
        readJson("package.json"),
        readJson("cli/package.json"),
        readJson("web/package.json"),
    ]);

    const versions = manifests.map((manifest) => manifest.version);
    const toolkitVersion = (await read(".agents/VERSION")).trim();

    assert.equal(new Set(versions).size, 1);
    assert.equal(versions[0], toolkitVersion);

    for (const lockfile of ["bun.lock", "cli/bun.lock", "web/bun.lock"]) {
        assert.equal(await fse.pathExists(path.join(repoRoot, lockfile)), true, `Missing ${lockfile}`);
    }
    for (const legacyLockfile of ["package-lock.json", "cli/package-lock.json", "web/package-lock.json"]) {
        assert.equal(await fse.pathExists(path.join(repoRoot, legacyLockfile)), false, `Legacy ${legacyLockfile} still exists`);
    }
});

test("public documentation reflects current paths and inventory", async () => {
    const [readme, changelog, claude] = await Promise.all([
        read("README.md"),
        read("CHANGELOG.md"),
        read("CLAUDE.md"),
    ]);

    assert.match(readme, /\.agents\//);
    assert.match(changelog, /calendar versioning/);
    assert.match(claude, /agx-kit/);
});

test("published CLI package includes its runtime library", async () => {
    const manifest = await readJson("cli/package.json");
    assert.ok(manifest.files.includes("lib"));
    assert.ok(manifest.files.includes("bin"));
});
