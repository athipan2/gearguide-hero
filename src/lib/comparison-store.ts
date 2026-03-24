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
  badge?: string;
  specs?: { label: string; value: string }[];
  aspectRatings?: { label: string; score: number }[];
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

        // If we already have 2 items, replace the second one (the "latest" one added)
        if (state.selectedItems.length >= 2) {
          const newItems = [...state.selectedItems];
          newItems[1] = item;
          return { selectedItems: newItems };
        }

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
