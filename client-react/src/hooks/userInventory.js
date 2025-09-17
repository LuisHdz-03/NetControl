import { useState, useEffect } from "react";
import { getItems, addItem, deleteItem } from "../services/inventoryServices.js";

export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const add = async (item) => {
    const newItem = await addItem(item);
    setItems([...items, newItem]);
  };

  const remove = async (id) => {
    await deleteItem(id);
    setItems(items.filter((i) => i.id !== id));
  };

  return { items, loading, add, remove };
}
