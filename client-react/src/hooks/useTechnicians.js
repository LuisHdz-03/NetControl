import { useState, useEffect, useCallback } from "react";
import { getTecnicos, addTecnico, deleteTecnico, updateTecnico } from "../services/technicians_service.js";
import { toast } from "react-toastify";

export function useTecnicos() {
    const [tecnicos, setTecnicos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTecnicos();
            setTecnicos(data);
        } catch (error) {
            console.error("Error al obtener los técnicos:", error);
            toast.error("Error al obtener los técnicos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Funciones de acción con toast.promise ---
    const add = async (tecnico) => {
        await toast.promise(
            (async () => {
                await addTecnico(tecnico);
                await fetchData();
            })(),
            {
                pending: "Agregando técnico...",
                success: "Técnico agregado correctamente",
                error: "Error al agregar el técnico"
            }
        );
    };

    const remove = async (id) => {
        await toast.promise(
            (async () => {
                await deleteTecnico(id);
                await fetchData();
            })(),
            {
                pending: "Eliminando técnico...",
                success: "Técnico eliminado",
                error: "Error al eliminar el técnico"
            }
        );
    };

    const update = async (id, data) => {
        await toast.promise(
            (async () => {
                await updateTecnico(id, data);
                await fetchData();
            })(),
            {
                pending: "Actualizando técnico...",
                success: "Técnico actualizado",
                error: "Error al actualizar el técnico"
            }
        );
    };

    return { tecnicos, loading, add, remove, update };
}
