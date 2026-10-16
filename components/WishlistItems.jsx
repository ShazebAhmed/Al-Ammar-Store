"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "./Providers";
import Icon from "./Icon";
import AddToCartButton from "./AddToCartButton";
import { formatMoney, productFromRow } from "@/lib/format";
import { photo, PHOTO_SIZES } from "@/lib/photo";

export default function WishlistItems({ settings }) {
  const { wishlist, wishlistReady, toggleWishlist, supabase, clientLoaded } =
    useStore();
  const [result, setResult] = useState({ key: null, products: [], error: "" });
  const [revision, setRevision] = useState(0);
  const ids = [...wishlist].sort().join(",");
  useEffect(() => {
    if (!wishlistReady || !ids || !clientLoaded) return;
    let cancelled = false;
    setResult({ key: null, products: [], error: "" });
    (async () => {
      try {
        if (!supabase) throw new Error("Store unavailable");
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", ids.split(","));
        if (error) throw error;
        if (!cancelled)
          setResult({
            key: ids,
            products: (data || []).map(productFromRow),
            error: "",
          });
      } catch {
        if (!cancelled)
          setResult({
            key: ids,
            products: [],
            error:
              "We couldn’t load your saved products. Your wishlist is still saved.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ids, wishlistReady, clientLoaded, supabase, revision]);

  if (!wishlistReady)
    return (
      <p className="muted" role="status">
        Opening your wishlist…
      </p>
    );
  if (!wishlist.length)
    return (
      <div className="empty-state">
        <Icon name="favorite_border" size={40} />
        <h2>No favourites saved yet.</h2>
        <p>Tap the heart on any product, then open Wishlist to find it here.</p>
        <Link className="stx-btn stx-btn-primary" href="/#collection">
          Explore the collection <Icon name="arrow_forward" />
        </Link>
      </div>
    );
  if (result.key !== ids)
    return (
      <p className="muted" role="status">
        Loading saved products…
      </p>
    );
  if (result.error)
    return (
      <div className="empty-state" role="alert">
        <p>{result.error}</p>
        <button
          className="stx-btn stx-btn-outline"
          onClick={() => setRevision((n) => n + 1)}
        >
          Try again
        </button>
      </div>
    );
  return (
    <section aria-labelledby="wishlist-items-heading">
      <h2 id="wishlist-items-heading" className="wishlist-items-heading">
        {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}
      </h2>
      <div className="wishlist-grid">
        {[...wishlist].reverse().map((id) => {
          const product = result.products.find((p) => p.id === id);
          return (
            <article className="wishlist-item" key={id}>
              <div className="wishlist-photo">
                {product ? (
                  <Link
                    href={`/product/${id}`}
                    aria-label={`View ${product.name}`}
                  >
                    {product.images?.[0] ? (
                      <img
                        {...photo(product.images[0], PHOTO_SIZES.card)}
                        alt={product.name}
                      />
                    ) : (
                      <Icon name="inventory_2" size={44} />
                    )}
                  </Link>
                ) : (
                  <Icon name="inventory_2" size={44} />
                )}
              </div>
              <div className="wishlist-item-body">
                <small className="product-category">
                  {product?.category || "Unavailable product"}
                </small>
                <h3>
                  {product ? (
                    <Link href={`/product/${id}`}>{product.name}</Link>
                  ) : (
                    "This product is no longer available"
                  )}
                </h3>
                {product && (
                  <strong>
                    {formatMoney(product.price, settings.currencySymbol)}
                  </strong>
                )}
                <div className="wishlist-item-actions">
                  {product &&
                    (Number(product.stock) <= 0 ? (
                      <span className="muted small">
                        Sold out · kept for later
                      </span>
                    ) : product.variants?.length ? (
                      <Link className="add-button" href={`/product/${id}`}>
                        Choose options <Icon name="arrow_forward" size={16} />
                      </Link>
                    ) : (
                      <AddToCartButton productId={id} stock={product.stock}>
                        Add to basket
                      </AddToCartButton>
                    ))}
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => toggleWishlist(id)}
                    aria-label={`Remove ${product?.name || "unavailable product"} from wishlist`}
                  >
                    <Icon name="close" size={15} /> Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
