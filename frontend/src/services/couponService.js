import API from './api';

export const couponService = {
  getActiveCoupons: async () => {
    const response = await API.get('/coupons');
    return response.data;
  },

  validateCoupon: async (code, cartTotal) => {
    const response = await API.get(`/coupons/validate`, {
      params: {
        code: code,
        amount: cartTotal,
        cartTotal: cartTotal
      }
    });
    return response.data;
  }
};
