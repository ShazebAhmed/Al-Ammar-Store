import test from "node:test";
import assert from "node:assert/strict";
import { filterStorePageView } from "../lib/storeAnalytics.js";

const view = (url) => ({ type: "pageview", url });

test("customer page views retain their path but remove queries and fragments", () => {
  const event = view(
    "https://alammarstore.vercel.app/product/p1?phone=03000000000#token",
  );
  assert.deepEqual(
    filterStorePageView(event),
    view("https://alammarstore.vercel.app/product/p1"),
  );
  assert.ok(event.url.includes("phone="));
});

test("admin, preview and local visits are excluded from customer counts", () => {
  for (const host of [
    "alammar-admin.vercel.app",
    "preview.vercel.app",
    "localhost:3000",
  ])
    assert.equal(filterStorePageView(view(`https://${host}/`)), null);
});

test("private pages and nested private routes are excluded", () => {
  for (const page of ["admin", "account", "auth", "reset-password", "track"])
    for (const suffix of ["", "/details"])
      assert.equal(
        filterStorePageView(
          view(`https://alammarstore.vercel.app/${page}${suffix}?token=secret`),
        ),
        null,
      );
});

test("invalid URLs and custom events are not collected", () => {
  assert.equal(filterStorePageView(view("not a URL")), null);
  assert.equal(
    filterStorePageView({
      type: "event",
      url: "https://alammarstore.vercel.app/",
    }),
    null,
  );
});
