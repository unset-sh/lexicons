// Protocol rules: https://atproto.com/specs/lexicon and https://atproto.com/specs/data-model.
// Pinned implementation: @atproto/lex-document 0.1.16 (lexicon-document.js),
// @atproto/lex-builder 0.1.20 (lex-builder.js), @atproto/lex-json 0.1.9 (lex-json.js),
// @atproto/lex-schema 0.2.11 (core/schema.js). No protocol constraints are reimplemented here.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "@atproto/lex-builder";
import * as document from "@atproto/lex-document";
import { jsonToLex } from "@atproto/lex-json";
import { l } from "@atproto/lex-schema";
import { docsProblems, type Schema } from "./docs.ts";

const ROOT = resolve(import.meta.dirname, "..");
type Node = Record<string, unknown>;
const object = (v: unknown): v is Node => typeof v === "object" && v !== null && !Array.isArray(v);
const read = (file: string) => readFileSync(file, "utf8");
const json = (file: string): unknown => JSON.parse(read(file));
const message = (error: unknown) => (error instanceof Error ? error.message : String(error));
const fullRef = (ref: string, nsid: string) => {
  const full = ref.startsWith("#") ? nsid + ref : ref;
  return full.includes("#") ? full : `${full}#main`;
};
const files = (root: string, ext: string): string[] =>
  existsSync(root)
    ? readdirSync(root, { recursive: true, withFileTypes: true })
        .filter((e) => e.isFile() && e.name.endsWith(ext))
        .map((e) => join(e.parentPath, e.name))
        .sort()
    : [];

// The official parser permits unknown keys. Lint authored schema keys from its own shapes,
// so a typo cannot silently drop a constraint. Permission parameters are intentionally open.
const schemaKeys = new Map<string, Set<string>>();
for (const value of Object.values(document)) {
  if (
    value instanceof l.ObjectSchema &&
    "type" in value.shape &&
    value.shape.type instanceof l.LiteralSchema
  ) {
    schemaKeys.set(String(value.shape.type.value), new Set(Object.keys(value.shape)));
  }
}
function unknownSchemaKeys(value: unknown, path: string): string[] {
  if (!object(value))
    return Array.isArray(value) ? value.flatMap((v, i) => unknownSchemaKeys(v, `${path}[${i}]`)) : [];
  const keys = path.endsWith(".json")
    ? new Set(Object.keys(document.lexiconDocumentSchema.shape))
    : schemaKeys.get(String(value.type));
  const problems = keys
    ? Object.keys(value)
        .filter((k) => !keys.has(k))
        .map((k) => `${path}: unknown schema key ${k}`)
    : [];
  return [
    ...problems,
    ...Object.entries(value)
      .filter(([k]) => !["knownValues", "enum", "default", "const"].includes(k))
      .flatMap(([k, v]) => unknownSchemaKeys(v, `${path}.${k}`)),
  ];
}

// This is authored-example spelling/coverage lint, after official validation. Protocol readers
// must preserve unknown fields and open-union variants; these examples document known definitions.
function inspectExample(
  value: unknown,
  definition: Node,
  nsid: string,
  defs: Map<string, Node>,
  covered: Set<string>,
  path: string,
): string[] {
  const follow = (ref: string): string[] => {
    const full = fullRef(ref, nsid);
    const target = defs.get(full);
    if (!target) return [`${path}: unknown example type ${ref}`];
    covered.add(full);
    return inspectExample(value, target, full.split("#")[0], defs, covered, path);
  };
  if (definition.type === "ref") return follow(String(definition.ref));
  if (definition.type === "union" && object(value)) return follow(String(value.$type));
  if (definition.type === "record" && object(definition.record))
    return inspectExample(value, definition.record, nsid, defs, covered, path);
  if (definition.type === "array" && Array.isArray(value) && object(definition.items)) {
    const item = definition.items;
    return value.flatMap((v, i) => inspectExample(v, item, nsid, defs, covered, `${path}[${i}]`));
  }
  if (definition.type !== "object" || !object(value)) return [];
  const properties = object(definition.properties) ? definition.properties : {};
  return Object.entries(value).flatMap(([key, val]) => {
    if (key === "$type") return [];
    const prop = properties[key];
    return object(prop)
      ? inspectExample(val, prop, nsid, defs, covered, `${path}.${key}`)
      : [`${path}: unknown example field ${key}`];
  });
}

function prose(text: string): string {
  return text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, "").replace(/`[^`\n]*`/g, "");
}
function anchors(text: string): Set<string> {
  const seen = new Map<string, number>();
  return new Set(
    [...prose(text).matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)].map(([, title = ""]) => {
      const slug = title
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/[^\p{L}\p{N}_\-\s]/gu, "")
        .replace(/\s/g, "-");
      const count = seen.get(slug) ?? 0;
      seen.set(slug, count + 1);
      return count ? `${slug}-${count}` : slug;
    }),
  );
}
function linkProblems(root: string): string[] {
  const pages = [
    ...files(join(root, "docs"), ".md"),
    ...files(join(root, "examples"), ".md"),
    ...readdirSync(root)
      .filter((f) => f.endsWith(".md"))
      .map((f) => join(root, f)),
  ];
  return pages.flatMap((page) => {
    const text = prose(read(page));
    const links = [
      ...text.matchAll(/!?\[[^\]\n]*\]\(<?([^\s)>]+)>?(?:\s+"[^"]*")?\)/g),
      ...text.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)>?/gm),
    ].map((m) => m[1]);
    return links.flatMap((href) => {
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return [];
      const [target = "", hash] = href.split("#");
      const file = target ? resolve(dirname(page), decodeURIComponent(target.split("?")[0])) : page;
      const at = relative(root, page);
      if (relative(root, file).startsWith("..") || !existsSync(file))
        return [`${at}: missing link target ${href}`];
      if (hash && file.endsWith(".md") && !anchors(read(file)).has(decodeURIComponent(hash)))
        return [`${at}: missing anchor ${href}`];
      return [];
    });
  });
}

function provenanceProblems(root: string, schemas: string[]): string[] {
  const path = join(root, "source.json");
  if (!existsSync(path)) return ["source.json: missing provenance manifest"];
  const source = json(path) as { schemas: Record<string, { sha256: string }> };
  const actual = new Set(schemas.map((file) => relative(root, file)));
  return [...new Set([...actual, ...Object.keys(source.schemas)])].flatMap((file) => {
    if (!actual.has(file) || !source.schemas[file])
      return [`source.json: schema inventory differs for ${file}`];
    const hash = createHash("sha256")
      .update(readFileSync(join(root, file)))
      .digest("hex");
    return hash === source.schemas[file].sha256 ? [] : [`${file}: SHA-256 differs from source.json`];
  });
}

export async function checkRepository(root = ROOT): Promise<string[]> {
  const schemaFiles = files(join(root, "lexicons"), ".json");
  const schemas: Schema[] = [];
  const problems = [...linkProblems(root), ...provenanceProblems(root, schemaFiles)];
  for (const file of schemaFiles) {
    const path = relative(root, file);
    try {
      const value = json(file);
      const parsed = document.lexiconDocumentSchema.parse(value);
      const expected = `lexicons/${parsed.id.replaceAll(".", "/")}.json`;
      if (path !== expected) problems.push(`${path}: does not match ${expected}`);
      problems.push(...unknownSchemaKeys(value, path));
      schemas.push({ nsid: parsed.id, defs: parsed.defs as Schema["defs"] });
    } catch (error) {
      problems.push(`${path}: invalid lexicon (${message(error)})`);
    }
  }
  if (!schemas.length) problems.push("lexicons/: no schemas found");
  if (
    problems.some(
      (p) =>
        p.includes("invalid lexicon") || p.includes("does not match") || p.includes("unknown schema key"),
    )
  )
    return problems;
  problems.push(...docsProblems(schemas, root));
  const generatedRoot = join(ROOT, ".generated");
  mkdirSync(generatedRoot, { recursive: true });
  const out = mkdtempSync(join(generatedRoot, "check-"));
  try {
    // build resolves every reference, including optional definitions absent from the examples.
    await build({ lexicons: join(root, "lexicons"), out, importExt: ".ts", fileExt: ".ts", pretty: false });
    const validators = new Map<string, l.Schema>();
    const definitions = new Map<string, Node>();
    for (const { nsid, defs } of schemas) {
      const generated = await import(pathToFileURL(join(out, `${nsid.replaceAll(".", "/")}.defs.ts`)).href);
      for (const [name, def] of Object.entries(defs)) {
        definitions.set(`${nsid}#${name}`, def);
        if (generated[name] instanceof l.Schema) validators.set(`${nsid}#${name}`, generated[name]);
      }
    }
    const covered = new Set<string>();
    for (const file of files(join(root, "examples"), ".json")) {
      const path = relative(root, file);
      try {
        const value = json(file);
        const type = object(value) ? String(value.$type) : "";
        const ref = fullRef(type, "");
        const validator = validators.get(ref);
        const definition = definitions.get(ref);
        if (!validator || !definition) throw new Error(`unknown record type ${type}`);
        validator.check(jsonToLex(value as Parameters<typeof jsonToLex>[0], { strict: true }));
        covered.add(ref);
        problems.push(...inspectExample(value, definition, type.split("#")[0], definitions, covered, path));
      } catch (error) {
        problems.push(`${path}: invalid example (${message(error)})`);
      }
    }
    for (const [ref, def] of definitions) {
      if (["record", "object"].includes(String(def.type)) && !covered.has(ref))
        problems.push(`examples/: no example covers ${ref}`);
    }
  } catch (error) {
    problems.push(`lexicon build: ${message(error)}`);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
  return problems;
}

if (import.meta.main) {
  const problems = await checkRepository();
  for (const problem of problems) process.stderr.write(`${problem}\n`);
  if (!problems.length)
    process.stdout.write("Schemas, examples, documentation, links and source hashes are valid.\n");
  process.exitCode = problems.length ? 1 : 0;
}
