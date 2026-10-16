import Link from "next/link";
import Icon from "@/components/Icon";
import WishlistItems from "@/components/WishlistItems";
import { getSettings } from "@/lib/catalogue";

export const metadata = {
  title: "Your wishlist",
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  const settings = await getSettings();
  return (
    <main className="page-wrap">
      <Link className="back-link" href="/#collection">
        <Icon name="chevron_left" size={15} /> Continue shopping
      </Link>
      <div className="page-heading">
        <span className="eyebrow">KEEP YOUR FAVOURITES CLOSE</span>
        <h1>
          Your wishlist<span className="gold-dot">.</span>
        </h1>
        <p>Tap a product’s heart to save it here for later.</p>
      </div>
      <div className="wishlist-note">
        <Icon name="favorite_border" size={22} />
        <p>
          No sign-in needed. Saved in this browser, not across devices. Adding
          an item to your basket keeps it here too. Saving does not reserve
          stock.
        </p>
      </div>
      <WishlistItems settings={settings} />
    </main>
  );
}
