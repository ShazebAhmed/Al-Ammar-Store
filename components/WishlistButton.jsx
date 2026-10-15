"use client";

import { useStore } from "./Providers";
import Icon from "./Icon";

export default function WishlistButton({
  productId,
  size = 18,
  className = "",
  showText = false,
}) {
  const { isInWishlist, toggleWishlist } = useStore();
  const wishlisted = isInWishlist(productId);

  return (
    <button
      type="button"
      className={`wishlist-button ${wishlisted ? "active" : ""} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-label={
        wishlisted ? "Remove from saved items" : "Save to your wishlist"
      }
      aria-pressed={wishlisted}
    >
      <Icon
        name={wishlisted ? "favorite" : "favorite_border"}
        size={size}
        style={{ color: wishlisted ? "var(--brick, #aa4d38)" : "inherit" }}
      />
      {showText && (
        <span>{wishlisted ? "Saved in wishlist" : "Save for later"}</span>
      )}
    </button>
  );
}
