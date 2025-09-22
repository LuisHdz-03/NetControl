import { useState, useEffect, useCallback } from "react";
import { getItems, getActiveUnits, addItem, deleteItem, activateUnit, deactivateUnit, updateItem, updateActiveUnit } from "../services/inventoryServices.js";

export function useInventory() {
    const [items, setItems] = useState([]); // Para el inventario general
    const [activeUnits, setActiveUnits] = useState([]); // <-- Para unidades activas
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [inventoryData, activeUnitsData] = await Promise.all([
                getItems(),
                getActiveUnits()
            ]);

            setItems(inventoryData);
            setActiveUnits(activeUnitsData);
        } catch (error) {
            console.error("Error al obtener los datos del inventario:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    // --- Las funciones de acción solo llaman a la API y luego refrescan ---
    const add = async (item) => {
        await addItem(item);
        fetchData(); // Refresca todos los datos para mantener la consistencia
    };

    const remove = async (id) => {
        await deleteItem(id);
        fetchData();
    };

    const update = async (id, data) => {
        await updateItem(id, data);
        fetchData();
    };


    const activate = async (inventario_id, ubicacion) => {
        await activateUnit(inventario_id, ubicacion);
        fetchData();
    };

    const deactivate = async (unidad_id) => {
        await deactivateUnit(unidad_id);
        fetchData();
    };

    const updateActive = async (id, data) => {
        await updateActiveUnit(id, data);
        fetchData();
    };

    // Devuelve los nuevos datos
    return { items, activeUnits, loading, add, remove, activate, deactivate, update, updateActive };
}