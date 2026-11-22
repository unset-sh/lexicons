import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkRepository } from "./check.ts";

const ROOT = join(import.meta.dirname, "..");
const card = "lexicons/sh/unset/card.json";
const sample = "examples/sh/unset/card/text.json";

function copyRepository(root: string) {
  for (const name of ["lexicons", "examples", "docs"])
    cpSync(join(ROOT, name), join(root, name), { recursive: true });
  for (const file of readdirSync(ROOT, { withFileTypes: true }).filter((file) => file.isFile())) {
    cpSync(join(ROOT, file.name), join(root, file.name));
  }
}

async function fixture(change: (root: string) => void, expected: RegExp) {
  const root = mkdtempSync(join(tmpdir(), "lexicons-check-test-"));
  try {
    copyRepository(root);
    change(root);
    assert.match((await checkRepository(root)).join("\n"), expected);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function edit(root: string, path: string, change: (value: any) => void) {
  const file = join(root, path);
  const value = JSON.parse(readFileSync(file, "utf8"));
  change(value);
  writeFileSync(file, JSON.stringify(value));
}

test("rejects schema syntax errors through the official document parser", async () => {
  await fixture(
    (root) =>
      edit(root, card, (s) => {
        s.lexicon = 2;
      }),
    /card\.json: invalid lexicon/,
  );
});

test("rejects a schema placed under a different NSID path", async () => {
  await fixture(
    (root) =>
      edit(root, card, (s) => {
        s.id = "sh.unset.other";
      }),
    /does not match.*sh\/unset\/other\.json/,
  );
});

test("rejects unresolved references even when no example exercises them", async () => {
  await fixture(
    (root) =>
      edit(root, card, (s) => {
        s.defs.main.record.properties.unused = { type: "ref", ref: "sh.unset.absent" };
      }),
    /reference|resolve|absent/i,
  );
});

test("refuses misspelled schema constraints", async () => {
  await fixture(
    (root) =>
      edit(root, card, (s) => {
        s.defs.main.record.properties.width.maxLenght = 32;
      }),
    /unknown.*maxLenght/,
  );
});

test("requires the provenance manifest", async () => {
  await fixture((root) => rmSync(join(root, "source.json")), /missing provenance manifest/);
});

test("rejects schema bytes that differ from their source digest", async () => {
  await fixture(
    (root) =>
      edit(root, card, (s) => {
        s.description = "Changed";
      }),
    /SHA-256 differs from source\.json/,
  );
});

test("detects a missing schema from the imported inventory", async () => {
  await fixture((root) => rmSync(join(root, "lexicons/sh/unset/authFull.json")), /schema inventory differs/);
});

test("validates nested required fields using freshly generated validators", async () => {
  await fixture(
    (root) =>
      edit(root, sample, (s) => {
        delete s.content.text;
      }),
    /text\.json: invalid example/,
  );
});

test("validates string length limits", async () => {
  await fixture(
    (root) =>
      edit(root, sample, (s) => {
        s.width = "x".repeat(33);
      }),
    /text\.json: invalid example/,
  );
});

test("decodes and checks blob CIDs rather than accepting arbitrary link text", async () => {
  await fixture(
    (root) =>
      edit(root, "examples/sh/unset/profile/full.json", (s) => {
        s.avatar.ref.$link = "not-a-cid";
      }),
    /full\.json: invalid example/,
  );
});

test("refuses unknown fields in nested authored examples", async () => {
  await fixture(
    (root) =>
      edit(root, "examples/sh/unset/card/showcase.json", (s) => {
        s.content.items[0].image.aspectRatio.wdith = 4;
      }),
    /unknown.*wdith/,
  );
});

test("detects a missing block example", async () => {
  await fixture((root) => rmSync(join(root, sample)), /no example covers sh\.unset\.block\.text#main/);
});

test("detects stale generated documentation", async () => {
  await fixture((root) => {
    const page = join(root, "docs/lexicons/card.md");
    writeFileSync(page, readFileSync(page, "utf8").replace("Record key: `tid`", "Record key: `self`"));
  }, /generated block is out of date/);
});

test("detects a definition missing its documentation", async () => {
  await fixture(
    (root) => rmSync(join(root, "docs/lexicons/block-text.md")),
    /no page documents sh\.unset\.block\.text#main/,
  );
});

test("checks links in root pages as well as nested docs", async () => {
  await fixture(
    (root) => writeFileSync(join(root, "README.md"), "[schema](lexicons/sh/unset/missing.json)\n"),
    /README\.md: missing link target/,
  );
});

test("checks relative Markdown heading anchors", async () => {
  await fixture(
    (root) => writeFileSync(join(root, "README.md"), "[guide](docs/quick-start.md#absent-heading)\n"),
    /missing anchor/,
  );
});

test("checks reference-style links", async () => {
  await fixture(
    (root) => writeFileSync(join(root, "README.md"), "[schema][target]\n\n[target]: lexicons/absent.json\n"),
    /missing link target/,
  );
});

test("ignores illustrative links inside fenced examples", async () => {
  const root = mkdtempSync(join(tmpdir(), "lexicons-links-test-"));
  try {
    copyRepository(root);
    writeFileSync(join(root, "README.md"), "```markdown\n[example](missing.md)\n```\n");
    assert.equal(
      (await checkRepository(root)).some((p) => p.includes("README.md")),
      false,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("accepts the complete checked-in documentation and examples", async () => {
  assert.deepEqual(await checkRepository(ROOT), []);
});
