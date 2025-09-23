const API_URL = "http://localhost:5000/failures";

// Obtener todas las fallas
export async function getFallas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener fallas");
  return res.json();
}

// Obtener una falla por ID
export async function getFalla(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Error al obtener la falla");
  return res.json();
}

// Crear una nueva falla
export async function addFalla(falla) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(falla),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al agregar la falla");
  return data;
}

// Actualizar una falla existente
export async function updateFalla(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Error al actualizar la falla");
  return result;
}

// Eliminar una falla
export async function deleteFalla(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar la falla");
  return res.json();
}
