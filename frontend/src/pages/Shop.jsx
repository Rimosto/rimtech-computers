import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
import { categories } from '../data/categories';
import { products } from '../data/products';
import { whatsappLink } from '../utils/whatsapp';
import './Shop.css';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeSlug = params.get('category');
  const activeCategory = categories.find((c) => c.slug === activeSlug) || null;

  const visible = activeCategory
    ? products.filter((p) => p.category === activeCategory.slug)
    : products;

  function selectCategory(slug) {
    if (slug) {
      setParams({ category: slug });
    } else {
      setParams({});
    }
  }

  const title = activeCategory ? activeCategory.name : 'Shop all products';

  return (
    <section className="container page">
      <div className="shop-head">
        <h1>{title}</h1>
        <p className="shop-count">
          {visible.length} {visible.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="chips" role="group" aria-label="Product categories">
        <button
          type="button"
          className={activeCategory ? 'chip' : 'chip active'}
          aria-pressed={!activeCategory}
          onClick={() => selectCategory(null)}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={activeCategory?.slug === c.slug ? 'chip active' : 'chip'}
            aria-pressed={activeCategory?.slug === c.slug}
            onClick={() => selectCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <h2>No {activeCategory ? activeCategory.name.toLowerCase() : 'products'} listed yet</h2>
          <p>
            We may still have what you need in stock. Message us on WhatsApp and we will check for
            you.
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
    </section>
  );
}
