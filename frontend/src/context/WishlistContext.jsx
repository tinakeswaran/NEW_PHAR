import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || isAdmin) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const [items, ids] = await Promise.all([
        wishlistService.getWishlist(),
        wishlistService.getWishlistIds()
      ]);
      setWishlistItems(items || []);
      setWishlistIds(new Set(ids || []));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = useCallback((medicineId) => {
    return wishlistIds.has(Number(medicineId));
  }, [wishlistIds]);

  const toggleWishlist = async (medicine) => {
    if (!isAuthenticated) {
      alert('Please log in to save medicines to your Wishlist.');
      return false;
    }
    const medId = Number(medicine.id || medicine);
    const wasWishlisted = wishlistIds.has(medId);

    // Optimistic UI update
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (wasWishlisted) next.delete(medId);
      else next.add(medId);
      return next;
    });

    if (wasWishlisted) {
      setWishlistItems(prev => prev.filter(item => (item.medicine?.id || item.id) !== medId));
    }

    try {
      const res = await wishlistService.toggleWishlist(medId);
      refreshWishlist();
      return res.wishlisted;
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
      // Revert on error
      refreshWishlist();
      return wasWishlisted;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistIds,
      wishlistCount: wishlistIds.size,
      isWishlisted,
      toggleWishlist,
      refreshWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
