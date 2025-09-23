import { useState, useEffect, useCallback } from "react";
import { 
    getFallas, 
    addFalla, 
    deleteFalla, 
    updateFalla 
} from "../services/failures_service.js";
import { toast } from "react-toastify";

export function useFallas() {
    const [fallas, setFallas] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getFallas();
            setFallas(data);
        } catch (error) {
            console.error("Error al obtener las fallas:", error);
            toast.error("Error al obtener las fallas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Funciones de acción ---
    const add = async (falla) => {
        await toast.promise(
            (async () => {
                await addFalla(falla);
                await fetchData();
            })(),
            {
                pending: "Agregando falla...",
                success: "Falla agregada correctamente",
                error: "Error al agregar la falla"
            }
        );
    };

    const remove = async (id) => {
        await toast.promise(
            (async () => {
                await deleteFalla(id);
                await fetchData();
            })(),
            {
                pending: "Eliminando falla...",
                success: "Falla eliminada",
                error: "Error al eliminar la falla"
            }
        );
    };

    const update = async (id, data) => {
        await toast.promise(
            (async () => {
                await updateFalla(id, data);
                await fetchData();
            })(),
            {
                pending: "Actualizando falla...",
                success: "Falla actualizada",
                error: "Error al actualizar la falla"
            }
        );
    };

    return { fallas, loading, add, remove, update };
}
