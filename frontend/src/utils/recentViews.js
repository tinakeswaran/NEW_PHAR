const STORAGE_KEY = 'valence_recently_viewed';
const MAX_ITEMS = 6;

export const recentViews = {
  add: (medicine) => {
    if (!medicine || !medicine.id) return;
    try {
      const existing = recentViews.get();
      const filtered = existing.filter(item => item.id !== medicine.id);
      const updated = [
        {
          id: medicine.id,
          name: medicine.name,
          brand: medicine.brand,
          price: medicine.price,
          categoryName: medicine.category?.name || '',
          dosage: medicine.dosage || '',
          badge: medicine.badge || '',
          imageUrl: medicine.imageUrl || '',
          requiresPrescription: medicine.requiresPrescription || false,
          stockQuantity: medicine.stockQuantity ?? 10
        },
        ...filtered
      ].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update recently viewed:', e);
    }
  },

  get: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }
};
