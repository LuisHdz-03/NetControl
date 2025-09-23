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
    const [newItem, setNewItem] = useState({ nombre: "", modelo: "", cantidadTotal: "" });
    
    // Estados para el registro múltiple de números de serie
    const [isSerialModalOpen, setSerialModalOpen] = useState(false);
    const [serialNumbers, setSerialNumbers] = useState([]);
    const [tempDeviceData, setTempDeviceData] = useState(null);

    // --- Estados para los Modales ---
    const [isActivationModalOpen, setActivationModalOpen] = useState(false);
    const [unitToActivate, setUnitToActivate] = useState(null);
    
    // Estados para el modal de selección de dispositivo específico
    const [isDeviceSelectionModalOpen, setDeviceSelectionModalOpen] = useState(false);
    const [selectedDeviceGroup, setSelectedDeviceGroup] = useState(null);
    const [selectedDeviceSerial, setSelectedDeviceSerial] = useState('');
    const [deviceLocation, setDeviceLocation] = useState('');
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Estados para selección en cascada (Actualizar dispositivo)
    const [isAdvancedUpdateModalOpen, setAdvancedUpdateModalOpen] = useState(false);
    const [selectedDeviceName, setSelectedDeviceName] = useState('');
    const [availableSerials, setAvailableSerials] = useState([]);
    const [selectedSerialForEdit, setSelectedSerialForEdit] = useState('');
    const [canEditDevice, setCanEditDevice] = useState(false);
    const [deviceToEdit, setDeviceToEdit] = useState(null);

    // --- Manejadores de Formularios ---
    const handleAddChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

    const agregarInventario = async (e) => {
        e.preventDefault();
        
        // Validar que la cantidad sea válida
        const cantidad = parseInt(newItem.cantidadTotal);
        if (!cantidad || cantidad < 1) {
            toast.error("La cantidad debe ser mayor a 0");
            return;
        }

        // Guardar datos temporales y abrir modal de números de serie
        setTempDeviceData({
            nombre: newItem.nombre.trim(),
            modelo: newItem.modelo.trim(),
            cantidadTotal: cantidad
        });
        
        // Inicializar array de números de serie vacíos
        setSerialNumbers(Array(cantidad).fill(''));
        setSerialModalOpen(true);
    };

    // Función para agregar múltiples dispositivos con números de serie únicos
    const confirmarRegistroMultiple = async () => {
        // Validar que todos los números de serie estén llenos
        const emptySerials = serialNumbers.some(serial => !serial.trim());
        if (emptySerials) {
            toast.error("Todos los números de serie son obligatorios");
            return;
        }

        // Validar que no haya números de serie duplicados
        const duplicates = serialNumbers.filter((item, index) => serialNumbers.indexOf(item) !== index);
        if (duplicates.length > 0) {
            toast.error("No puede haber números de serie duplicados");
            return;
        }

        // Registrar cada dispositivo por separado
        try {
            const registrationPromises = serialNumbers.map(noSerie => 
                add({
                    nombre: tempDeviceData.nombre,
                    modelo: tempDeviceData.modelo,
                    noSerie: noSerie.trim(),
                    cantidadTotal: 1 // Cada dispositivo es una unidad individual
                })
            );

            await toast.promise(
                Promise.all(registrationPromises),
                {
                    pending: `Registrando ${serialNumbers.length} dispositivos...`,
                    success: `¡${serialNumbers.length} dispositivos registrados con éxito!`,
                    error: "Error al registrar algunos dispositivos"
                }
            );

            // Limpiar estados
            setNewItem({ nombre: "", modelo: "", cantidadTotal: "" });
            setSerialNumbers([]);
            setTempDeviceData(null);
            setSerialModalOpen(false);
            setActiveTab("activar");
            
        } catch (error) {
            toast.error("Error al registrar los dispositivos");
        }
    };

    // Función para manejar cambios en números de serie
    const handleSerialChange = (index, value) => {
        const newSerialNumbers = [...serialNumbers];
        newSerialNumbers[index] = value;
        setSerialNumbers(newSerialNumbers);
    };

    // Función para cancelar el registro múltiple
    const cancelarRegistroMultiple = () => {
        setSerialModalOpen(false);
        setSerialNumbers([]);
        setTempDeviceData(null);
    };

    // Función para cancelar el formulario de agregar dispositivos
    const cancelarAgregarDispositivo = () => {
        setNewItem({ nombre: "", modelo: "", cantidadTotal: "" });
        setActiveTab("vista"); // Volver a la pestaña de vista
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
    const handleActivateClick = (deviceGroup) => {
        // Filtrar solo dispositivos inactivos del grupo
        const inactiveDevices = deviceGroup.devices.filter(device => device.cantidadInactiva > 0);
        
        if (inactiveDevices.length === 0) {
            toast.error('No hay dispositivos disponibles para activar');
            return;
        }
        
        setSelectedDeviceGroup(deviceGroup);
        setSelectedDeviceSerial('');
        setDeviceLocation('');
        setDeviceSelectionModalOpen(true);
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
    
    // Nueva función para confirmar activación del dispositivo seleccionado
    const handleConfirmDeviceActivation = async () => {
        if (!selectedDeviceSerial) {
            toast.error('Debe seleccionar un dispositivo');
            return;
        }
        
        if (!deviceLocation.trim()) {
            toast.error('La ubicación es requerida');
            return;
        }
        
        // Encontrar el dispositivo específico por número de serie
        const selectedDevice = selectedDeviceGroup.devices.find(device => device.noSerie === selectedDeviceSerial);
        
        if (!selectedDevice) {
            toast.error('Dispositivo no encontrado');
            return;
        }
        
        await toast.promise(
            activate(selectedDevice.id, deviceLocation.trim()),
            {
                pending: 'Activando dispositivo...',
                success: '¡Dispositivo activado con éxito!',
                error: {
                    render({ data }) {
                        return data.message || "Error desconocido al activar el dispositivo";
                    }
                }
            }
        );
        
        // Cerrar modal y limpiar estados
        setDeviceSelectionModalOpen(false);
        setSelectedDeviceGroup(null);
        setSelectedDeviceSerial('');
        setDeviceLocation('');
    };
    
    // Función para cancelar selección de dispositivo
    const cancelDeviceSelection = () => {
        setDeviceSelectionModalOpen(false);
        setSelectedDeviceGroup(null);
        setSelectedDeviceSerial('');
        setDeviceLocation('');
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

    // --- Funciones para selección en cascada (Actualizar dispositivo) ---
    const openAdvancedUpdateModal = () => {
        setAdvancedUpdateModalOpen(true);
        setSelectedDeviceName('');
        setSelectedSerialForEdit('');
        setAvailableSerials([]);
        setCanEditDevice(false);
        setDeviceToEdit(null);
    };

    const closeAdvancedUpdateModal = () => {
        setAdvancedUpdateModalOpen(false);
        setSelectedDeviceName('');
        setSelectedSerialForEdit('');
        setAvailableSerials([]);
        setCanEditDevice(false);
        setDeviceToEdit(null);
    };

    const handleDeviceNameChange = (deviceName) => {
        setSelectedDeviceName(deviceName);
        setSelectedSerialForEdit('');
        setCanEditDevice(false);
        setDeviceToEdit(null);
        
        if (deviceName) {
            // Filtrar números de serie disponibles para este nombre de dispositivo
            const serialsForDevice = items
                .filter(item => item.nombre === deviceName)
                .map(item => item.noSerie);
            setAvailableSerials(serialsForDevice);
        } else {
            setAvailableSerials([]);
        }
    };

    const handleSerialNumberChange = (serialNumber) => {
        setSelectedSerialForEdit(serialNumber);
        
        if (selectedDeviceName && serialNumber) {
            // Buscar el dispositivo específico que coincida con nombre y número de serie
            const device = items.find(item => 
                item.nombre === selectedDeviceName && item.noSerie === serialNumber
            );
            
            if (device) {
                setDeviceToEdit(device);
                setCanEditDevice(true);
            } else {
                setDeviceToEdit(null);
                setCanEditDevice(false);
            }
        } else {
            setDeviceToEdit(null);
            setCanEditDevice(false);
        }
    };

    const handleConfirmAdvancedUpdate = async () => {
        if (!canEditDevice || !deviceToEdit) {
            toast.error("Selecciona un dispositivo válido para editar");
            return;
        }

        const { id, ...data } = deviceToEdit;

        try {
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
        } catch (error) {
            toast.error("Error desconocido");
        } finally {
            setAdvancedUpdateModalOpen(false);
            setSelectedDeviceName('');
            setSelectedSerialForEdit('');
            setAvailableSerials([]);
            setCanEditDevice(false);
            setDeviceToEdit(null);
        }
    };

    const handleAdvancedUpdateChange = (e) => {
        if (!deviceToEdit) return;
        setDeviceToEdit({ ...deviceToEdit, [e.target.name]: e.target.value });
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
    
    // Agrupar dispositivos solo por nombre
    const groupedInventoryItems = useMemo(() => {
        const filtered = items.filter(item => ['nombre', 'modelo'].some(prop => item[prop]?.toLowerCase().includes(search.toLowerCase())));
        
        const groups = filtered.reduce((acc, item) => {
            // Usar solo el nombre como clave principal para agrupar
            const key = item.nombre;
            if (!acc[key]) {
                acc[key] = {
                    id: key,
                    nombre: item.nombre,
                    modelo: item.modelo, // Tomar el modelo del primer dispositivo
                    devices: [],
                    cantidadTotal: 0,
                    cantidadActiva: 0,
                    cantidadInactiva: 0,
                    uniqueModels: new Set() // Rastrear modelos únicos dentro del grupo
                };
            }
            
            acc[key].devices.push(item);
            acc[key].cantidadTotal += item.cantidadTotal;
            acc[key].cantidadActiva += item.cantidadActiva;
            acc[key].cantidadInactiva += item.cantidadInactiva;
            acc[key].uniqueModels.add(item.modelo);
            
            return acc;
        }, {});
        
        // Convertir a array y agregar información de modelos únicos
        return Object.values(groups).map(group => ({
            ...group,
            displayName: group.nombre,
            modelInfo: group.uniqueModels.size > 1 
                ? `Múltiples modelos (${group.uniqueModels.size})`
                : group.modelo,
            uniqueModels: Array.from(group.uniqueModels) // Convertir Set a Array
        }));
    }, [items, search]);
    
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
        groupedInventoryItems,
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
        handleConfirmUpdate,

        // Estados para el modal de números de serie
        isSerialModalOpen,
        serialNumbers,
        tempDeviceData,
        // Funciones para el modal de números de serie
        confirmarRegistroMultiple,
        handleSerialChange,
        cancelarRegistroMultiple,
        // Función para cancelar agregar dispositivo
        cancelarAgregarDispositivo,
        
        // Estados para agrupación de dispositivos
        groupedInventoryItems,
        
        // Estados para selección de dispositivo específico
        isDeviceSelectionModalOpen,
        selectedDeviceGroup,
        selectedDeviceSerial,
        setSelectedDeviceSerial,
        deviceLocation,
        setDeviceLocation,
        // Funciones para selección de dispositivo
        handleConfirmDeviceActivation,
        cancelDeviceSelection,

        // Estados para selección cascada en edición
        isAdvancedUpdateModalOpen,
        selectedDeviceName,
        availableSerials,
        selectedSerialForEdit,
        canEditDevice,
        deviceToEdit,
        // Funciones para selección cascada en edición
        openAdvancedUpdateModal,
        closeAdvancedUpdateModal,
        handleDeviceNameChange,
        handleSerialNumberChange,
        handleConfirmAdvancedUpdate,
        handleAdvancedUpdateChange
    };
};
