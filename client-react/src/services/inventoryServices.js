const API_URL = "http://localhost:5000/items";

export async function getItems() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener inventario");
  return res.json();
}

export async function addItem(item) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Error al agregar dispositivo");
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar dispositivo");
  return res.json();
}
