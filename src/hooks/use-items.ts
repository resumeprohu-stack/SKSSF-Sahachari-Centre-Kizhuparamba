
import { useState, useEffect, useCallback } from 'react';
import type { Item } from '@/lib/types';
import { items as initialItems } from '@/lib/data';

const STORAGE_KEY = 'sahachari-items';

export function useItems() {
  const [items, setItemsState] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItemsState(JSON.parse(storedItems));
      } else {
        // If nothing is in storage, initialize with default data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));
        setItemsState(initialItems);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to initial data if localStorage is not available
      setItemsState(initialItems);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setItems = useCallback((newItems: Item[] | ((prevItems: Item[]) => Item[])) => {
    setItemsState(prevItems => {
        const updatedItems = typeof newItems === 'function' ? newItems(prevItems) : newItems;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
        } catch (error) {
            console.error("Failed to save items to localStorage:", error);
        }
        return updatedItems;
    });
  }, []);

  return { items, setItems, isLoading };
}
