"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { STORE_HOST } from "@/lib/hosts";
import { filterStorePageView } from "@/lib/storeAnalytics";

export default function StoreAnalytics() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(window.location.hostname === STORE_HOST);
  }, []);
  return enabled ? <Analytics beforeSend={filterStorePageView} /> : null;
}
