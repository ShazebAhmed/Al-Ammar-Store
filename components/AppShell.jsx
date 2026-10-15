"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
export default function AppShell({ settings, children }) {
  const pathname = usePathname() || "";
  const admin = pathname.startsWith("/admin");
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {!admin && <Header settings={settings} />}
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      {!admin && <Footer settings={settings} />}
      {!admin && <CartDrawer />}
    </>
  );
}
