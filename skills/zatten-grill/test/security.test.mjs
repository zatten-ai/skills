// As travas do zatten-grill contra site malicioso no navegador: Host (DNS rebinding),
// a chave do servidor e a origem dos envios. Roda com: node --test test/security.test.mjs
import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { request } from "node:http";
import test from "node:test";

const server = join(dirname(fileURLToPath(import.meta.url)), "..", "server.mjs");
const home = mkdtempSync(join(tmpdir(), "zgrill-"));
const env = { ...process.env, GRILL_HOME: home };
const run = (...a) => execFileSync("node", [server, ...a], { env, cwd: home, encoding: "utf8" });

const { session } = JSON.parse(run("new", "--topic", "Segurança"));
const srv = spawn("node", [server, "serve", "--session", session], { env, cwd: home });
const ready = await new Promise((ok) => srv.stdout.on("data", (d) => { const l = String(d).split("\n").find((x) => x.includes('"ready"')); if (l) ok(JSON.parse(l)); }));
const url = new URL(ready.url);
const key = url.searchParams.get("k");
const port = url.port;

// http.request deixa controlar o Host, que o fetch não deixa.
const call = (path, { method = "GET", host = `127.0.0.1:${port}`, headers = {}, body } = {}) =>
  new Promise((ok, ko) => {
    const r = request({ host: "127.0.0.1", port, path, method, headers: { host, ...headers } }, (res) => {
      let b = ""; res.on("data", (c) => (b += c)); res.on("end", () => ok({ status: res.statusCode, body: b }));
    });
    r.on("error", ko); if (body) r.write(body); r.end();
  });

test.after(() => srv.kill());

test("a URL que o agente abre traz a chave, e server.json também", () => {
  assert.match(key, /^[0-9a-f]{32}$/);
  assert.equal(JSON.parse(readFileSync(join(session, "server.json"), "utf8")).key, key);
});
test("Host de outro domínio é recusado (DNS rebinding)", async () => {
  assert.equal((await call(`/state?k=${key}`, { host: `atacante.com:${port}` })).status, 403);
  assert.equal((await call("/", { host: `atacante.com:${port}` })).status, 403);
});
test("sem a chave, nada além da página", async () => {
  assert.equal((await call("/")).status, 200);
  assert.equal((await call("/state")).status, 403);
  assert.equal((await call("/events")).status, 403);
  assert.equal((await call("/state?k=00000000000000000000000000000000")).status, 403);
});
test("com a chave, lê o estado (por query ou cabeçalho)", async () => {
  assert.equal((await call(`/state?k=${key}`)).status, 200);
  assert.equal((await call("/state", { headers: { "x-grill-key": key } })).status, 200);
});
test("envio exige a chave e a origem deste servidor", async () => {
  const body = JSON.stringify({ actions: [{ type: "finish" }] });
  const h = { "content-type": "application/json" };
  assert.equal((await call("/send", { method: "POST", headers: h, body })).status, 403);
  assert.equal((await call("/send", { method: "POST", headers: { ...h, "x-grill-key": key, origin: "http://atacante.com" }, body })).status, 403);
  assert.equal((await call("/send", { method: "POST", headers: { ...h, "x-grill-key": key, origin: `http://127.0.0.1:${port}` }, body })).status, 200);
});
