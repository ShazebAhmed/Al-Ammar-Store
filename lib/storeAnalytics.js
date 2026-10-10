import { STORE_HOST } from "./hosts.js";

// Account, sign-in and order-tracking links can contain private information.
const privatePages = [
  "/admin",
  "/account",
  "/auth",
  "/reset-password",
  "/track",
];

export function filterStorePageView(event) {
  try {
    const url = new URL(event.url);
    if (
      url.hostname !== STORE_HOST ||
      event.type !== "pageview" ||
      privatePages.some(
        (page) => url.pathname === page || url.pathname.startsWith(`${page}/`),
      )
    )
      return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}
