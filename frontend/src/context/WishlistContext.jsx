import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const stored = localStorage.getItem('sm_wishlist');
  const [items, setItems] = useState(stored ? JSON.parse(stored) : []);

  useEffect(() => {
    localStorage.setItem('sm_wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (product) => {
    setItems((prev) =>
      prev.find((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product]
    );
  };

  const isWishlisted = (id) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
