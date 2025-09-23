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

    // --- Funciones de acción que llaman a la API y refrescan ---
    const add = async (tecnico) => {
        try {
            await addTecnico(tecnico);
            toast.success("Técnico agregado correctamente");
            fetchData();
        } catch (error) {
            console.error("Error al agregar técnico:", error);
            toast.error("Error al agregar el técnico");
            throw error;
        }
    };

    const remove = async (id) => {
        try {
            await deleteTecnico(id);
            toast.success("Técnico eliminado");
            fetchData();
        } catch (error) {
            console.error("Error al eliminar técnico:", error);
            toast.error("Error al eliminar el técnico");
        }
    };

    const update = async (id, data) => {
        try {
            await updateTecnico(id, data);
            toast.success("Técnico actualizado");
            fetchData();
        } catch (error) {
            console.error("Error al actualizar técnico:", error);
            toast.error("Error al actualizar el técnico");
        }
    };

    // Devuelve los datos y funciones para manejar técnicos
    return { tecnicos, loading, add, remove, update };
}
