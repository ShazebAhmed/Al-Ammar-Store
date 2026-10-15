"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { formatMoney } from "@/lib/format";
import { photo, PHOTO_SIZES } from "@/lib/photo";

export default function LiveSearch({
  defaultValue = "",
  currencySymbol = "Rs.",
}) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search matches with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setIsOpen(true);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="live-search-container" ref={containerRef}>
      <label className="catalogue-search">
        <Icon name="search" />
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          placeholder="Find something you’ll love…"
          aria-label="Search products"
          autoComplete="off"
        />
        {loading && (
          <span
            className="live-search-spinner"
            aria-label="Loading search results"
          >
            <Icon name="sync" size={16} />
          </span>
        )}
      </label>

      {/* Instant Dropdown Preview */}
      {isOpen && query.trim().length >= 2 && (
        <div className="live-search-dropdown" role="listbox">
          {results.length > 0 ? (
            <>
              <div className="live-search-header">
                <span>Matching Finds ({results.length})</span>
              </div>
              <div className="live-search-list">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="live-search-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="live-search-thumb">
                      {product.images?.[0] ? (
                        <img
                          {...photo(product.images[0], PHOTO_SIZES.thumb)}
                          alt={product.name}
                        />
                      ) : (
                        <Icon name="inventory_2" size={20} />
                      )}
                    </div>
                    <div className="live-search-details">
                      <span className="live-search-category">
                        {product.category || "Collection"}
                      </span>
                      <strong className="live-search-title">
                        {product.name}
                      </strong>
                      <span className="live-search-price">
                        {formatMoney(product.price, currencySymbol)}
                      </span>
                    </div>
                    {product.stock <= 0 ? (
                      <span className="live-search-badge sold-out">
                        Sold out
                      </span>
                    ) : (
                      <span className="live-search-arrow">
                        <Icon name="arrow_forward" size={14} />
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="live-search-footer">
                <button
                  type="submit"
                  className="live-search-all-btn"
                  onClick={() => setIsOpen(false)}
                >
                  View all results for &ldquo;{query}&rdquo; →
                </button>
              </div>
            </>
          ) : !loading ? (
            <div className="live-search-empty">
              <p>No products found for &ldquo;{query}&rdquo;</p>
              <small className="muted">
                Try searching for a different keyword or explore the collection.
              </small>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
