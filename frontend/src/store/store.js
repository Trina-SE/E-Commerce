import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  total: 0,

  addItem: (item) => {
    const { items } = get();
    const existingItem = items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity || 1;
    } else {
      items.push({ ...item, quantity: item.quantity || 1 });
    }

    localStorage.setItem('cart', JSON.stringify(items));
    set({ items });
  },

  removeItem: (productId) => {
    const { items } = get();
    const filteredItems = items.filter((i) => i.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(filteredItems));
    set({ items: filteredItems });
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const item = items.find((i) => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        const filteredItems = items.filter((i) => i.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(filteredItems));
        set({ items: filteredItems });
      } else {
        localStorage.setItem('cart', JSON.stringify(items));
        set({ items });
      }
    }
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
