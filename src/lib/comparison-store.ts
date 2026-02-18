import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  name: string;
  brand: string;
  image: string;
  rating: number;
  price: string;
  weight?: string;
  drop?: string;
  slug?: string;
}

interface ComparisonState {
  selectedItems: Product[];
  addItem: (item: Product) => void;
  removeItem: (itemName: string) => void;
  clear: () => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      selectedItems: [],
      addItem: (item) => set((state) => {
        if (state.selectedItems.find(i => i.name === item.name)) return state;
        if (state.selectedItems.length >= 3) return state; // Limit to 3
        return { selectedItems: [...state.selectedItems, item] };
      }),
      removeItem: (itemName) => set((state) => ({
        selectedItems: state.selectedItems.filter(i => i.name !== itemName)
      })),
      clear: () => set({ selectedItems: [] }),
    }),
    {
      name: 'gear-comparison-storage',
    }
  )
);
