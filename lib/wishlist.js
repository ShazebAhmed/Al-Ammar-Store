export const WISHLIST_KEY = "al-ammar:wishlist";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Saved IDs are sent to a UUID database column; discard corrupt/old values.
export function readWishlist(value) {
  try {
    const ids = JSON.parse(value || "[]");
    return Array.isArray(ids)
      ? [
          ...new Set(
            ids
              .filter((id) => typeof id === "string" && UUID.test(id))
              .map((id) => id.toLowerCase()),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}
