import API from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await API.get('/wishlist');
    return response.data;
  },

  getWishlistIds: async () => {
    const response = await API.get('/wishlist/ids');
    return response.data;
  },

  toggleWishlist: async (medicineId) => {
    const response = await API.post(`/wishlist/toggle/${medicineId}`);
    return response.data;
  },

  checkWishlist: async (medicineId) => {
    const response = await API.get(`/wishlist/check/${medicineId}`);
    return response.data;
  },

  removeFromWishlist: async (medicineId) => {
    const response = await API.delete(`/wishlist/${medicineId}`);
    return response.data;
  }
};
