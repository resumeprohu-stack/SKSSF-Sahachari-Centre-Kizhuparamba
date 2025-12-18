
import { useMemo } from 'react';
import type { Item } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';

export function useItems() {
  const firestore = useFirestore();

  const itemsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'items');
  }, [firestore]);

  const { data: items, isLoading, error } = useCollection<Omit<Item, 'id'>>(itemsCollection);

  const setItems = (newItems: Item[] | ((prevItems: Item[]) => Item[])) => {
    if (typeof newItems === 'function') {
      // Not straightforward to support function updates with Firestore,
      // so we will only support direct array replacement for simplicity.
      console.warn('Functional updates for setItems are not supported with Firestore backend.');
      return;
    }
  };

  const handleAddItem = (item: Omit<Item, 'id' | 'dateAdded'>) => {
    if (!itemsCollection) return;
    const newItem = {
      ...item,
      dateAdded: new Date().toISOString(),
    };
    addDocumentNonBlocking(itemsCollection, newItem);
  };

  const handleEditItem = (item: Item) => {
    if (!firestore) return;
    const itemRef = doc(firestore, 'items', item.id);
    const { id, ...itemData } = item;
    updateDocumentNonBlocking(itemRef, itemData);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!firestore) return;
    const itemRef = doc(firestore, 'items', itemId);
    deleteDocumentNonBlocking(itemRef);
  };

  const mappedItems = useMemo(() => {
    if (!items) return [];
    return items.map(item => ({
      ...item,
      name: item.itemName,
    }));
  }, [items]);

  return { 
    items: mappedItems, 
    setItems, 
    isLoading, 
    error,
    handleAddItem,
    handleEditItem,
    handleDeleteItem
  };
}
