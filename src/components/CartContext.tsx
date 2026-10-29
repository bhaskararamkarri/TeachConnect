"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  coverImageUrl: string;
  priceCents: number;
  sellerStoreName: string;
  licenseType: "SINGLE_USER" | "SCHOOL_SEAT";
  seatCount: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "seatCount"> & { seatCount?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateSeats: (productId: string, seatCount: number) => void;
  clearCart: () => void;
  subtotalCents: number;
  totalCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("teachconnect_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("teachconnect_cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (newItem: Omit<CartItem, "seatCount"> & { seatCount?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId
            ? { ...i, seatCount: i.seatCount + (newItem.seatCount || 1) }
            : i
        );
      }
      return [...prev, { ...newItem, seatCount: newItem.seatCount || 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateSeats = (productId: string, seatCount: number) => {
    if (seatCount <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, seatCount } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotalCents = items.reduce((sum, item) => {
    // School seats get a 15% discount per additional seat
    if (item.licenseType === "SCHOOL_SEAT" && item.seatCount > 1) {
      const base = item.priceCents;
      const additional = (item.seatCount - 1) * Math.round(item.priceCents * 0.85);
      return sum + base + additional;
    }
    return sum + item.priceCents * item.seatCount;
  }, 0);

  const totalCount = items.reduce((sum, item) => sum + item.seatCount, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateSeats,
        clearCart,
        subtotalCents,
        totalCount,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

