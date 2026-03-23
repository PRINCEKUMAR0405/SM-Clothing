import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import { products, categories, formatPrice } from '../data/products.js';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Discount' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'newest', label: 'New Arrivals' },
];

export default function Products() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const isSale = searchParams.get('sale') === 'true';
  const isNew = searchParams.get('new') === 'true';

  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [view, setView] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const cat = categories.find((c) => c.slug === category);

  const allSizes = [...new Set(products.flatMap((p) => p.sizes))];
  const allColors = [...new Set(products.flatMap((p) => p.colors))];

  const filtered = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : [...products];
    if (isSale) list = list.filter((p) => p.discount > 0);
    if (isNew) list = list.filter((p) => p.newArrival);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedSizes.length) list = list.filter((p) => selectedSizes.some((s) => p.sizes.includes(s)));
    if (selectedColors.length) list = list.filter((p) => selectedColors.some((c) => p.colors.includes(c)));
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);

    switch (sort) {
      case 'price-asc': return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...list].sort((a, b) => b.price - a.price);
      case 'discount': return [...list].sort((a, b) => b.discount - a.discount);
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'newest': return [...list].filter((p) => p.newArrival).concat([...list].filter((p) => !p.newArrival));
      default: return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [category, sort, isSale, isNew, priceRange, selectedSizes, selectedColors, minRating]);

  const toggleSize = (s) => setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleColor = (c) => setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const pageTitle = cat ? cat.name : isSale ? 'Sale' : isNew ? 'New Arrivals' : 'All Products';

  return (
    <div className="products-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{pageTitle}</span>
          </nav>
        </div>
      </div>

      {/* Category hero */}
      {cat && (
        <div className="cat-hero">
          <img src={cat.image} alt={cat.name} className="cat-hero-img" />
          <div className="cat-hero-overlay" />
          <div className="container cat-hero-content">
            <h1>{cat.name}</h1>
            <p>{cat.description}</p>
          </div>
        </div>
      )}

      <div className="container products-layout">
        {/* Filters sidebar */}
        <aside className={`filters-sidebar${filtersOpen ? ' open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="filter-clear" onClick={() => { setSelectedSizes([]); setSelectedColors([]); setMinRating(0); setPriceRange([0, 15000]); }}>
              Clear All
            </button>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range-labels">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <input type="range" min="0" max="15000" step="100" value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="range-slider" />
          </div>

          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-chips">
              {allSizes.slice(0, 12).map((s) => (
                <button key={s} className={`size-chip${selectedSizes.includes(s) ? ' selected' : ''}`} onClick={() => toggleSize(s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <div className="rating-options">
              {[4, 3, 2].map((r) => (
                <button key={r} className={`rating-chip${minRating === r ? ' selected' : ''}`} onClick={() => setMinRating(minRating === r ? 0 : r)}>
                  {r}★ & above
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="products-main">
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle-btn" onClick={() => setFiltersOpen((o) => !o)}>
                <SlidersHorizontal size={16} /> {filtersOpen ? 'Hide' : 'Show'} Filters
              </button>
              <span className="results-count">{filtered.length} items</span>
              {isSale && <span className="badge badge-primary">SALE</span>}
              {isNew && <span className="badge badge-black">NEW IN</span>}
            </div>
            <div className="toolbar-right">
              <div className="sort-select-wrap">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="sort-chevron" />
              </div>
              <div className="view-toggle">
                <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid3X3 size={16} /></button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={16} /></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>No products found matching your filters.</p>
              <button className="btn btn-outline" onClick={() => { setSelectedSizes([]); setSelectedColors([]); setMinRating(0); setPriceRange([0, 15000]); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid-4' : 'list-view'}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
