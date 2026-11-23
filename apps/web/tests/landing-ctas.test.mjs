import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Test the actual exported CTA configuration without changing the Next.js app
// or requiring an additional test runner. TypeScript is already a web dev dep.
const siteSource = readFileSync(join(__dirname, "../src/lib/site.ts"), "utf8");
const { outputText } = ts.transpileModule(siteSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
});
const compiledExports = {};
runInNewContext(outputText, { exports: compiledExports }, { filename: "site.ts" });

const { BUSINESS_CTA, BUSINESS_LOGIN_PATH } = compiledExports;

function emailHref(cta) {
  const url = new URL(cta.href);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "hola@withsenda.site");
  assert.ok(url.searchParams.get("subject"), "a distinct subject is required");
  assert.ok(url.searchParams.get("body"), "email draft should explain the intent");
  assert.notEqual(cta.href, BUSINESS_LOGIN_PATH);
  return url;
}

test("all landing CTAs describe their email action and have distinct URLs", () => {
  const ctas = [BUSINESS_CTA.contact, BUSINESS_CTA.waitlist, BUSINESS_CTA.information];
  assert.equal(new Set(ctas.map((cta) => cta.href)).size, ctas.length);
  assert.equal(new Set(ctas.map((cta) => emailHref(cta).searchParams.get("subject"))).size, ctas.length);
  for (const cta of ctas) {
    assert.match(cta.label, /correo/i);
  }
});

test("contact CTA sends a business inquiry, not a waitlist signup", () => {
  const url = emailHref(BUSINESS_CTA.contact);
  assert.match(url.searchParams.get("subject"), /consulta empresarial/i);
  assert.doesNotMatch(url.searchParams.get("subject"), /lista de espera/i);
});

test("waitlist CTA opens an explicit request instead of navigating to sign-in", () => {
  const url = emailHref(BUSINESS_CTA.waitlist);
  assert.match(url.searchParams.get("subject"), /lista de espera/i);
  assert.match(url.searchParams.get("body"), /solicitar un lugar/i);
  assert.match(BUSINESS_CTA.waitlist.label, /lista de espera/i);
  assert.match(BUSINESS_CTA.waitlist.note, /aplicación de correo/i);
  assert.match(BUSINESS_CTA.waitlist.note, /no es una inscripción automática/i);
});

test("globe CTA requests product information, not the waitlist", () => {
  const url = emailHref(BUSINESS_CTA.information);
  assert.match(url.searchParams.get("subject"), /solicitud de información/i);
  assert.doesNotMatch(url.searchParams.get("subject"), /lista de espera/i);
});

test("hero and globe actually wire up their matching CTA destinations", () => {
  const hero = readFileSync(join(__dirname, "../src/components/business/hero.tsx"), "utf8");
  const globe = readFileSync(join(__dirname, "../src/components/business/globe-section.tsx"), "utf8");
  assert.match(hero, /href=\{BUSINESS_CTA\.contact\.href\}/);
  assert.match(hero, /href=\{BUSINESS_CTA\.waitlist\.href\}/);
  assert.match(hero, /aria-describedby="waitlist-email-note"/);
  assert.doesNotMatch(hero, /BUSINESS_LOGIN_PATH/);
  assert.match(globe, /href=\{BUSINESS_CTA\.information\.href\}/);
});
