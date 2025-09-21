const API_URL = "http://localhost:5000/inventory";
const UNIDADES_URL = "http://localhost:5000/unidades_activas";

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
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error al agregar dispositivo");
  }
  return data;
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar dispositivo");
  return res.json();
}

export async function updateItem(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar el dispositivo");
  return res.json();
}

// ------------------------
// Unidades activas
// ------------------------
export async function activateUnit(inventario_id, ubicacion) {
  const res = await fetch(UNIDADES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inventario_id, ubicacion }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Error al activar unidad");
  }

  return data;
}

export async function deactivateUnit(unidad_id) {
  const res = await fetch(`${UNIDADES_URL}/${unidad_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al desactivar unidad");
  return res.json();
}

export const getActiveUnits = async () => {
    const response = await fetch(UNIDADES_URL);
    if (!response.ok) {
        throw new Error('Error al obtener las unidades activas');
    }
    return response.json();
};

export async function updateActiveUnit(id, data) {
  const res = await fetch(`${UNIDADES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar la unidad activa");
  return res.json();
}

