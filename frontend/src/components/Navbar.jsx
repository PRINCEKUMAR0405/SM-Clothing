import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ShoppingBag, Heart, Search, Menu, X, User, ChevronDown, Package } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Men', path: '/category/men' },
  { label: 'Women', path: '/category/women' },
  { label: 'Kids', path: '/category/kids' },
  { label: 'Accessories', path: '/category/accessories' },
  { label: 'Sale', path: '/products?sale=true' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/search?q=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-sm">SM</span>
            <span className="logo-text">Clothing</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="navbar-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.path} to={l.path} className={`nav-link${location.pathname === l.path ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search for clothes, brands…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Icons */}
          <div className="navbar-icons">
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <Heart size={22} />
              {wishlistItems.length > 0 && <span className="badge-count">{wishlistItems.length}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn" title="Cart">
              <ShoppingBag size={22} />
              {totalItems > 0 && <span className="badge-count">{totalItems}</span>}
            </Link>

            {/* User menu */}
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button className="nav-icon-btn" onClick={() => setUserMenuOpen((o) => !o)} title="Profile">
                <User size={22} />
                {user && <ChevronDown size={14} />}
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  {user ? (
                    <>
                      <div className="dropdown-header">
                        <p className="dropdown-name">{user.name}</p>
                        <p className="dropdown-email">{user.email}</p>
                      </div>
                      <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <User size={15} /> My Profile
                      </Link>
                      <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Package size={15} /> My Orders
                      </Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Heart size={15} /> Wishlist
                      </Link>
                      {user.isAdmin && (
                        <Link to="/admin" className="dropdown-item dropdown-admin" onClick={() => setUserMenuOpen(false)}>
                          📊 Admin Dashboard
                        </Link>
                      )}
                      <button className="dropdown-item dropdown-logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link to="/register" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button className="nav-icon-btn mobile-menu-btn" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <form className="mobile-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          {NAV_LINKS.map((l) => (
            <Link key={l.path} to={l.path} className="mobile-link">{l.label}</Link>
          ))}
          <div className="mobile-divider" />
          {user ? (
            <>
              <Link to="/profile" className="mobile-link">My Profile</Link>
              <Link to="/orders" className="mobile-link">My Orders</Link>
              {user.isAdmin && <Link to="/admin" className="mobile-link">Admin Dashboard</Link>}
              <button className="mobile-link mobile-logout" onClick={logout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Sign In</Link>
              <Link to="/register" className="mobile-link">Create Account</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
