import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import Pagination from '../components/common/Pagination';
import ProductCard from '../components/products/ProductCard';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { filterProducts, sortOptions } from '../utils/filterProducts';
import { whatsappLink } from '../utils/whatsapp';
import './Shop.css';

const PAGE_SIZE = 8;

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const gridTop = useRef(null);

  const categorySlug = params.get('category') || '';
  const q = params.get('q') || '';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const sort = params.get('sort') || 'featured';

  const activeCategory = categories.find((c) => c.slug === categorySlug) || null;
  const filtersActive = Boolean(q || min || max);

  const filtered = useMemo(
    () => filterProducts(products, { category: activeCategory?.slug, q, min, max, sort }),
    [activeCategory, q, min, max, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = parseInt(params.get('page'), 10) || 1;
  const page = Math.min(Math.max(requestedPage, 1), totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function update(changes, replace = false) {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    // Any change other than the page number returns to page 1
    if (!('page' in changes)) next.delete('page');
    setParams(next, { replace });
  }

  function goToPage(n) {
    update({ page: n === 1 ? '' : String(n) });
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function clearFilters() {
    update({ q: '', min: '', max: '', sort: '' });
  }

  const title = activeCategory ? activeCategory.name : 'Shop all products';
  const countLabel = filtered.length === 1 ? 'product' : 'products';

  return (
    <section className="container page">
      <div className="shop-head">
        <h1>{title}</h1>
        <p className="shop-count">
          <span>
            {filtered.length} {countLabel}
            {totalPages > 1 && ` (page ${page} of ${totalPages})`}
          </span>
          {filtersActive && (
            <button type="button" className="link-button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </p>
      </div>

      <div className="toolbar">
        <div className="field-search">
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            type="search"
            className="input"
            placeholder="Search by name, brand or model"
            value={q}
            onChange={(e) => update({ q: e.target.value }, true)}
          />
        </div>

        <div>
          <label htmlFor="shop-min" className="sr-only">
            Minimum price in KSh
          </label>
          <input
            id="shop-min"
            type="number"
            inputMode="numeric"
            min="0"
            className="input"
            placeholder="Min KSh"
            value={min}
            onChange={(e) => update({ min: e.target.value }, true)}
          />
        </div>

        <div>
          <label htmlFor="shop-max" className="sr-only">
            Maximum price in KSh
          </label>
          <input
            id="shop-max"
            type="number"
            inputMode="numeric"
            min="0"
            className="input"
            placeholder="Max KSh"
            value={max}
            onChange={(e) => update({ max: e.target.value }, true)}
          />
        </div>

        <div className="field-sort">
          <label htmlFor="shop-sort" className="sr-only">
            Sort products
          </label>
          <select
            id="shop-sort"
            className="input"
            value={sort}
            onChange={(e) => update({ sort: e.target.value === 'featured' ? '' : e.target.value })}
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chips" role="group" aria-label="Product categories">
        <button
          type="button"
          className={activeCategory ? 'chip' : 'chip active'}
          aria-pressed={!activeCategory}
          onClick={() => update({ category: '' })}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={activeCategory?.slug === c.slug ? 'chip active' : 'chip'}
            aria-pressed={activeCategory?.slug === c.slug}
            onClick={() => update({ category: c.slug })}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div ref={gridTop} style={{ scrollMarginTop: '110px' }}>
        {visible.length > 0 ? (
          <>
            <div className="product-grid">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
          </>
        ) : filtersActive ? (
          <div className="shop-empty">
            <h2>No products match your search</h2>
            <p>
              Try a different word or a wider price range. If you are looking for something
              specific, message us and we will check what is available.
            </p>
            <div className="shop-empty-actions">
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button
                href={whatsappLink(
                  q
                    ? `Hello RimTech, I am looking for ${q}. Do you have it available?`
                    : 'Hello RimTech, I am looking for a product within a specific budget.'
                )}
                target="_blank"
                rel="noreferrer"
              >
                Ask on WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <div className="shop-empty">
            <h2>No {activeCategory ? activeCategory.name.toLowerCase() : 'products'} listed yet</h2>
            <p>
              We may still have what you need in stock. Message us on WhatsApp and we will check
              for you.
            </p>
            <Button
              href={whatsappLink(
                `Hello RimTech, do you have any ${activeCategory ? activeCategory.name.toLowerCase() : 'products'} available?`
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
