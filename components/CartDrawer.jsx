"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "./Providers";
import useCartProducts from "./useCartProducts";
import Icon from "./Icon";
import { formatMoney } from "@/lib/format";
import { cartTotals, lineStock } from "@/lib/cart";
import { photo, PHOTO_SIZES } from "@/lib/photo";
import { whatsappOrderLink } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { isCartDrawerOpen, closeCartDrawer, setCartQty, removeFromCart } =
    useStore();
  const { lines, settings, loading, error, invalid } = useCartProducts();
  const drawerRef = useRef(null);

  // Close on Escape key press and manage body scroll
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isCartDrawerOpen) {
        closeCartDrawer();
      }
    }
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const valid = lines.filter((l) => l.product);
  const totals = cartTotals(
    valid,
    settings.shippingFee,
    settings.freeDeliveryOver,
  );
  const money = (n) => formatMoney(n, settings.currencySymbol);
  const freeOver = Number(settings.freeDeliveryOver) || 0;
  const progressPercent =
    freeOver > 0
      ? Math.min(100, Math.round((totals.subtotal / freeOver) * 100))
      : 100;
  const whatsappLink = invalid ? "" : whatsappOrderLink(settings, valid);

  return (
    <div
      className="cart-drawer-overlay"
      onClick={closeCartDrawer}
      aria-modal="true"
      role="dialog"
      aria-label="Shopping basket drawer"
    >
      <aside
        className="cart-drawer"
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="drawer-title-wrap">
            <span className="eyebrow">YOUR BASKET</span>
            <h2>
              Selected finds <span className="gold-dot">({lines.length})</span>
            </h2>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeCartDrawer}
            aria-label="Close basket"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {freeOver > 0 && lines.length > 0 && (
          <div className="drawer-free-delivery">
            <div className="free-delivery-text">
              <Icon name="local_shipping" size={16} />
              {totals.freeLeft > 0 ? (
                <span>
                  Add <strong>{money(totals.freeLeft)}</strong> more for{" "}
                  <strong className="gold-text">FREE Delivery</strong>
                </span>
              ) : (
                <span className="free-unlocked">
                  🎉 <strong>FREE Delivery unlocked!</strong>
                </span>
              )}
            </div>
            <div className="delivery-progress-track">
              <div
                className="delivery-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Content */}
        <div className="cart-drawer-body">
          {loading ? (
            <div className="drawer-empty-state">
              <p className="muted">Updating your basket…</p>
            </div>
          ) : error ? (
            <div className="drawer-empty-state">
              <p className="small muted">{error}</p>
            </div>
          ) : !lines.length ? (
            <div className="drawer-empty-state">
              <Icon name="shopping_cart" size={44} />
              <h3>Your basket is empty</h3>
              <p className="small muted">
                Explore our everyday collection and find something you’ll love.
              </p>
              <Link
                href="/#collection"
                className="stx-btn stx-btn-primary"
                onClick={closeCartDrawer}
              >
                Explore collection <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          ) : (
            <div className="drawer-items-list">
              {lines.map((l) => (
                <article
                  key={`${l.productId}:${l.variant || ""}`}
                  className="drawer-item"
                >
                  <div className="drawer-item-thumb">
                    {l.product?.images?.[0] ? (
                      <img
                        {...photo(l.product.images[0], PHOTO_SIZES.thumb)}
                        alt={l.product.name}
                      />
                    ) : (
                      <Icon name="inventory_2" size={24} />
                    )}
                  </div>
                  <div className="drawer-item-info">
                    <h4>
                      {l.product ? (
                        <Link
                          href={`/product/${l.productId}`}
                          onClick={closeCartDrawer}
                        >
                          {l.product.name}
                        </Link>
                      ) : (
                        "Unavailable product"
                      )}
                    </h4>
                    {l.variant && (
                      <span className="drawer-variant-tag">
                        {l.product?.optionLabel || "Option"}: {l.variant}
                      </span>
                    )}
                    <div className="drawer-item-price">
                      {l.product ? money(l.product.price) : "—"}
                    </div>

                    {l.product && (
                      <div className="drawer-qty-row">
                        <div className="quantity-control small">
                          <button
                            type="button"
                            aria-label={`Decrease ${l.product.name}`}
                            onClick={() =>
                              setCartQty(
                                l.productId,
                                l.qty - 1,
                                lineStock(l.product, l.variant),
                                l.variant,
                              )
                            }
                          >
                            <Icon name="remove" size={13} />
                          </button>
                          <output>{l.qty}</output>
                          <button
                            type="button"
                            aria-label={`Increase ${l.product.name}`}
                            disabled={l.qty >= lineStock(l.product, l.variant)}
                            onClick={() =>
                              setCartQty(
                                l.productId,
                                l.qty + 1,
                                lineStock(l.product, l.variant),
                                l.variant,
                              )
                            }
                          >
                            <Icon name="add" size={13} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="drawer-remove-btn"
                          onClick={() => removeFromCart(l.productId, l.variant)}
                          aria-label={`Remove ${l.product.name}`}
                        >
                          <Icon name="delete" size={14} /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {lines.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-summary-row">
              <span className="muted">Subtotal</span>
              <span className="stx-mono font-bold">
                {money(totals.subtotal)}
              </span>
            </div>
            <div className="drawer-summary-row small">
              <span className="muted">Delivery (Pakistan)</span>
              <span>
                {totals.shipping === 0 ? (
                  <strong className="gold-text">FREE</strong>
                ) : (
                  money(totals.shipping)
                )}
              </span>
            </div>
            <div className="drawer-summary-row total-row">
              <strong>Estimated Total</strong>
              <strong className="stx-mono text-lg">
                {money(totals.total)}
              </strong>
            </div>

            <div className="drawer-actions">
              <Link
                href="/checkout"
                className="stx-btn stx-btn-primary drawer-checkout-btn"
                onClick={closeCartDrawer}
              >
                Proceed to Checkout <Icon name="arrow_forward" size={16} />
              </Link>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stx-btn stx-btn-whatsapp"
                >
                  <Icon name="chat" size={16} /> Order via WhatsApp
                </a>
              )}

              <Link
                href="/cart"
                className="drawer-view-cart-link"
                onClick={closeCartDrawer}
              >
                View full basket & details
              </Link>
            </div>
            <p className="drawer-cod-note">
              <Icon name="check" size={12} /> Cash on delivery · Pay when parcel
              arrives
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
