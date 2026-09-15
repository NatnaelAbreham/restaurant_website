import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const clearCart = () => {
    setCartItems([]);
  };

  
  const addToCart = (item) => {
  setCartItems(prev => {
    const existing = prev.find(i => i.id === item.id);

    if (existing) {

      // Limited stock
      if (
        item.quantityLimit &&
        existing.quantity >= item.quantityAvailable
      ) {
        return prev;
      }

      return prev.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    }

    return [...prev, { ...item, quantity: 1 }];
  });
};

  const updateQuantity = (id, qty) => {
  setCartItems(prev =>
    prev
      .map(item => {
        if (item.id !== id) return item;

        if (qty <= 0) {
          return null;
        }

        // Only enforce quantity when stock is limited
        if (
          item.quantityLimit &&
          qty > item.quantityAvailable
        ) {
          return item;
        }

        return {
          ...item,
          quantity: qty
        };
      })
      .filter(Boolean)
  );
};

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handlePlaceOrder = () => {
    if (!cartItems.length) return;
    setShowSuccess(true);
    setCartItems([]);
    setIsCartOpen(false);
  };

  const totalItems = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        isCartOpen,
        setIsCartOpen,
        showSuccess,
        setShowSuccess,
        addToCart,
        updateQuantity,
        removeItem,
        handlePlaceOrder,
        totalItems,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);