import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { products } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const results = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <div className="container" style={{ padding: '32px 16px 56px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Search size={20} style={{ color: 'var(--muted)' }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
          Search results for "<span style={{ color: 'var(--primary)' }}>{q}</span>"
        </h1>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>{results.length} results found</p>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
          <Search size={48} strokeWidth={1} style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>No results found</h3>
          <p>Try different keywords or browse our categories.</p>
        </div>
      ) : (
        <div className="grid-4">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
