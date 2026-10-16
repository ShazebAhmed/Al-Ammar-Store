"use client";

import { useStore } from "./Providers";
import Icon from "./Icon";

export default function WishlistButton({
  productId,
  productName = "this product",
  size = 18,
  className = "",
  showText = false,
}) {
  const { isInWishlist, toggleWishlist, wishlistReady } = useStore();
  const wishlisted = isInWishlist(productId);

  return (
    <button
      type="button"
      disabled={!wishlistReady}
      title={
        wishlisted ? "Remove from wishlist" : "Save for later in your wishlist"
      }
      className={`wishlist-button ${wishlisted ? "active" : ""} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      aria-label={
        wishlisted
          ? `Remove ${productName} from wishlist`
          : `Save ${productName} to wishlist`
      }
      aria-pressed={wishlisted}
    >
      <Icon
        name={wishlisted ? "favorite" : "favorite_border"}
        fill={wishlisted}
        size={size}
        style={{ color: wishlisted ? "var(--brick, #aa4d38)" : "inherit" }}
      />
      {showText && (
        <span>{wishlisted ? "Saved · Remove" : "Save for later"}</span>
      )}
    </button>
  );
}
