import { useState, useEffect, useCallback } from "react";
import { 
    getFallas, 
    addFalla, 
    deleteFalla, 
    updateFalla 
} from "../services/failures_service.js";

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
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Funciones de acción ---
    const add = async (falla) => {
        await addFalla(falla);
        fetchData();
    };

    const remove = async (id) => {
        await deleteFalla(id);
        fetchData();
    };

    const update = async (id, data) => {
        await updateFalla(id, data);
        fetchData();
    };

    // Devuelve datos y funciones
    return { fallas, loading, add, remove, update };
}
