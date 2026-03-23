import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => !(i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor)) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity < 1) {
        return { ...state, items: state.items.filter((i) => !(i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor)) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id && i.selectedSize === action.payload.selectedSize && i.selectedColor === action.payload.selectedColor
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const stored = localStorage.getItem('sm_cart');
  const [state, dispatch] = useReducer(cartReducer, { items: stored ? JSON.parse(stored) : [] });

  useEffect(() => {
    localStorage.setItem('sm_cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items: state.items, dispatch, totalItems, subtotal, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
