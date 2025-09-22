const API_URL = "http://localhost:5000/technicians";

export async function getTecnicos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener técnicos");
  return res.json();
}

export async function addTecnico(tecnico) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tecnico),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al agregar técnico");
  return data;
}

export async function deleteTecnico(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar técnico");
  return res.json();
}

export async function updateTecnico(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar el técnico");
  return res.json();
}