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
        try {
            await addFalla(falla);
            toast.success("Falla agregada correctamente");
            await fetchData();
        } catch (error) {
            console.error("Error al agregar falla:", error);
            toast.error("Error al agregar la falla");
            throw error;
        }
    };

    const remove = async (id) => {
        try {
            await deleteFalla(id);
            toast.info("Falla eliminada");
            fetchData();
        } catch (error) {
            console.error("Error al eliminar falla:", error);
            toast.error("Error al eliminar la falla");
        }
    };

    const update = async (id, data) => {
        try {
            await updateFalla(id, data);
            toast.success("Falla actualizada");
            fetchData();
        } catch (error) {
            console.error("Error al actualizar falla:", error);
            toast.error("Error al actualizar la falla");
        }
    };

    // Devuelve datos y funciones
    return { fallas, loading, add, remove, update };
}
