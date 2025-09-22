import { useState, useMemo } from "react";
import { useInventory as useInventoryAPI } from "./useInventory";
import { toast } from "react-toastify";

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
        const cleanedItem = {
            nombre: newItem.nombre.trim(),
            modelo: newItem.modelo.trim(),
            noSerie: newItem.noSerie.trim(),
            cantidadTotal: newItem.cantidadTotal
        };

        await toast.promise(
            add(cleanedItem),
            {
                pending: 'Agregando dispositivo...',
                success: '¡Dispositivo agregado con éxito!',
                error: {
                    render({ data }) {
                        return data.message || "Error desconocido al agregar el dispositivo";
                    }
                }
            }
        );
        setNewItem({ nombre: "", modelo: "", noSerie: "", cantidadTotal: "" });
        setActiveTab("activar");
    };

    const eliminarDispositivo = async (id) => {
        await toast.promise(
            remove(id),
            {
                pending: "Eliminando dispositivo...",
                success: "¡Dispositivo eliminado con éxito!",
                error: {
                    render({ data }) {
                        return data.message || "Error desconocido al eliminar el dispositivo";
                    }
                }
            }
        );
    };

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

        await toast.promise(
            activate(unitToActivate.id, unitToActivate.ubicacion), {
            pending: "Activando unidad...",
            success: "¡Unidad activada!",
            error: "Error al activar la unidad"
        }
        );
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

        try {
            if (type === 'inventory') {
                const inventoryData = {
                    nombre: data.nombre,
                    modelo: data.modelo,
                    noSerie: data.noSerie,
                    cantidadTotal: data.cantidadTotal
                };
                await toast.promise(
                    update(id, inventoryData),
                    {
                        pending: "Actualizando dispositivo...",
                        success: "¡Actualización realizada con éxito!",
                        error: "Error al actualizar"
                    }
                );
            } else if (type === 'activeUnit') {
                await toast.promise(
                    updateActive(id, { ubicacion: data.ubicacion }),
                    {
                        pending: "Actualizando ubicación...",
                        success: "¡Se actualizó la ubicación!",
                        error: "Error al actualizar ubicación"
                    }
                );
            }
        } catch (error) {
            toast.error("Error desconocido");
        } finally {
            setUpdateModalOpen(false);
        }
    };

    const handleDesactivar = async (id) => {
        await toast.promise(
            deactivate(id),
            {
                pending: "Desactivando dispositivo...",
                success: "¡Dispositivo desactivado con éxito!",
                error: "Error al desactivar!",
            }
        );
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
