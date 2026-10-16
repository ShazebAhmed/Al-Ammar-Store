import test from "node:test";
import assert from "node:assert/strict";
import { readWishlist } from "../lib/wishlist.js";

const id = "a39be5c2-532a-4a35-a975-2ab17cc9a97e";
test("wishlist restores existing saved IDs and deduplicates UUID casing", () => {
  assert.deepEqual(readWishlist(JSON.stringify([id, id.toUpperCase()])), [id]);
});
test("corrupt storage cannot send invalid IDs to the product query", () => {
  for (const value of [null, "bad json", "{}", "null", "42"])
    assert.deepEqual(readWishlist(value), []);
  assert.deepEqual(readWishlist(JSON.stringify([null, 42, {}, "", "p1", id])), [
    id,
  ]);
});
