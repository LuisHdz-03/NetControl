import { useState, useEffect, useCallback } from "react";
import { getTecnicos, addTecnico, deleteTecnico, updateTecnico } from "../services/technicians_service.js";

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
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Funciones de acción que llaman a la API y refrescan ---
    const add = async (tecnico) => {
        await addTecnico(tecnico);
        fetchData();
    };

    const remove = async (id) => {
        await deleteTecnico(id);
        fetchData();
    };

    const update = async (id, data) => {
        await updateTecnico(id, data);
        fetchData();
    };

    // Devuelve los datos y funciones para manejar técnicos
    return { tecnicos, loading, add, remove, update };
}
