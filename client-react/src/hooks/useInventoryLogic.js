import { useState, useMemo } from "react";
import { useInventory as useInventoryAPI } from "./useInventory";

export const useInventoryLogic = () => {
    // --- API Data Hook ---
    const {
        items,
        activeUnits,
        loading,
        add,
        remove,
        activate,
        deactivate,
        update,
        updateActive
    } = useInventoryAPI();

    // --- Estados de la UI ---
    const [activeTab, setActiveTab] = useState("vista");
    const [search, setSearch] = useState("");
    const [newItem, setNewItem] = useState({ nombre: "", modelo: "", noSerie: "", cantidadTotal: "" });

    // --- Estados para los Modales ---
    const [isActivationModalOpen, setActivationModalOpen] = useState(false);
    const [unitToActivate, setUnitToActivate] = useState(null);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // --- Manejadores de Formularios ---
    const handleAddChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

    const agregarInventario = async (e) => {
        e.preventDefault();
        await add(newItem);
        setNewItem({ nombre: "", modelo: "", noSerie: "", cantidadTotal: "" });
        setActiveTab("activar");
    };

    const eliminarDispositivo = (id) => remove(id);

    // --- Configuracion para el Modal de Activación ---
    const handleActivateClick = (item) => {
        setUnitToActivate({ ...item, ubicacion: '' });
        setActivationModalOpen(true);
    };

    const handleConfirmActivation = async () => {
        if (!unitToActivate?.ubicacion.trim()) {
            alert("Por favor, ingresa una ubicación.");
            return;
        }
        await activate(unitToActivate.id, unitToActivate.ubicacion);
        setActivationModalOpen(false);
    };

    // --- Configuracion para el Modal de Actualización ---
    const openUpdateModal = (item, type) => {
        setEditingItem({ ...item, type });
        setUpdateModalOpen(true);
    };

    const handleUpdateChange = (e) => {
        setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
    };

    const handleConfirmUpdate = async () => {
        if (!editingItem) return;

        const { id, type, ...data } = editingItem;

        if (type === 'inventory') {
            const inventoryData = {
                nombre: data.nombre,
                modelo: data.modelo,
                noSerie: data.noSerie,
                cantidadTotal: data.cantidadTotal
            };
            await update(id, inventoryData);
        } else if (type === 'activeUnit') {
            await updateActive(id, { ubicacion: data.ubicacion });
        }

        setUpdateModalOpen(false);
    };

    const handleDesactivar = async (id) => {
        await deactivate(id); 
        setActiveTab("activar");
    };

    // --- Datos Filtrados---
    const filteredActiveUnits = useMemo(() => activeUnits.filter(unit => Object.values(unit).some(val => String(val).toLowerCase().includes(search.toLowerCase()))), [activeUnits, search]);
    const filteredInventoryItems = useMemo(() => items.filter(item => ['nombre', 'modelo', 'noSerie'].some(prop => item[prop]?.toLowerCase().includes(search.toLowerCase()))), [items, search]);

    // --- Exportación de todo lo necesario para la UI ---
    return {
        loading,
        activeTab,
        setActiveTab,
        search,
        setSearch,
        newItem,
        handleAddChange,
        agregarInventario,
        eliminarDispositivo,
        filteredActiveUnits,
        filteredInventoryItems,
        handleDesactivar,

        // Const para el modal de activación
        isActivationModalOpen,
        setActivationModalOpen,
        unitToActivate,
        setUnitToActivate,
        handleActivateClick,
        handleConfirmActivation,

        // Const para el modal de actualización
        isUpdateModalOpen,
        setUpdateModalOpen,
        editingItem,
        openUpdateModal,
        handleUpdateChange,
        handleConfirmUpdate
    };
};
