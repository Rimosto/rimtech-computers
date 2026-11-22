import { categories } from '../data/categories';

const categoryNames = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

export const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
  { value: 'newest', label: 'Newest' },
];

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function hasPrice(product) {
  return product.price !== null && product.price !== undefined;
}

function comparePrice(a, b, direction) {
  const aHas = hasPrice(a);
  const bHas = hasPrice(b);
  if (!aHas && !bHas) return 0;
  if (!aHas) return 1;
  if (!bHas) return -1;
  return direction * (a.price - b.price);
}

export function filterProducts(products, { category, q, min, max, sort } = {}) {
  const terms = (q || '').toLowerCase().split(/\s+/).filter(Boolean);
  const minPrice = toNumber(min);
  const maxPrice = toNumber(max);
  const priceFilterOn = minPrice !== null || maxPrice !== null;

  const result = products.filter((p) => {
    if (category && p.category !== category) return false;

    if (terms.length > 0) {
      const haystack = [p.name, p.brand, p.model, categoryNames[p.category]]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!terms.every((t) => haystack.includes(t))) return false;
    }

    if (priceFilterOn) {
      if (!hasPrice(p)) return false;
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;
    }

    return true;
  });

  const sorted = [...result];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => comparePrice(a, b, 1));
      break;
    case 'price-desc':
      sorted.sort((a, b) => comparePrice(a, b, -1));
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      sorted.sort((a, b) => b.id - a.id);
      break;
    default:
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.id - b.id);
  }
  return sorted;
}
