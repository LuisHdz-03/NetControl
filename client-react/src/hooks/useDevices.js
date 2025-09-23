import { useState, useEffect, useCallback } from "react";
import devicesService from "../services/devicesService";
import { toast } from "react-toastify";

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    managed: 0,
    byType: {},
  });

  // Cargar dispositivos
  const loadDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const devicesData = await devicesService.getAllDevices();
      setDevices(Array.isArray(devicesData) ? devicesData : []);

      // Actualizar estadísticas
      await updateStats();
    } catch (err) {
      setError("Error al cargar los dispositivos");
      console.error("Error loading devices:", err);
      toast.error("Error al cargar los dispositivos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar estadísticas
  const updateStats = useCallback(async () => {
    try {
      const statsData = await devicesService.getDeviceStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error updating stats:", err);
    }
  }, []);

  // Escanear la red
  const scanNetwork = useCallback(
    async (networkRange = null) => {
      setScanning(true);
      setError(null);

      try {
        toast.info("Iniciando escaneo de red...", { autoClose: 2000 });

        const result = await devicesService.scanNetwork(networkRange);

        if (result.success) {
          toast.success(
            `Escaneo completado: ${result.devices_found} dispositivos encontrados, ${result.devices_added} nuevos, ${result.devices_updated} actualizados`,
            { autoClose: 5000 }
          );

          // Recargar la lista de dispositivos
          await loadDevices();
        } else {
          throw new Error(result.error || "Error en el escaneo");
        }
      } catch (err) {
        setError("Error al escanear la red");
        console.error("Error scanning network:", err);
        toast.error(`Error al escanear la red: ${err.message}`);
      } finally {
        setScanning(false);
      }
    },
    [loadDevices]
  );

  // Actualizar dispositivo
  const updateDevice = useCallback(
    async (deviceId, deviceData) => {
      try {
        const updatedDevice = await devicesService.updateDevice(
          deviceId,
          deviceData
        );

        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === deviceId ? updatedDevice : device
          )
        );

        toast.success("Dispositivo actualizado correctamente");
        await updateStats();
      } catch (err) {
        console.error("Error updating device:", err);
        toast.error("Error al actualizar el dispositivo");
        throw err;
      }
    },
    [updateStats]
  );

  // Eliminar dispositivo
  const deleteDevice = useCallback(
    async (deviceId) => {
      try {
        await devicesService.deleteDevice(deviceId);

        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deviceId)
        );

        toast.success("Dispositivo eliminado correctamente");
        await updateStats();
      } catch (err) {
        console.error("Error deleting device:", err);
        toast.error("Error al eliminar el dispositivo");
        throw err;
      }
    },
    [updateStats]
  );

  // Obtener dispositivo por ID
  const getDeviceById = useCallback(async (deviceId) => {
    try {
      return await devicesService.getDeviceById(deviceId);
    } catch (err) {
      console.error("Error getting device:", err);
      toast.error("Error al obtener el dispositivo");
      throw err;
    }
  }, []);

  // Filtrar dispositivos
  const filterDevices = useCallback(
    (filters) => {
      let filtered = [...devices];

      if (filters.status) {
        filtered = filtered.filter(
          (device) => device.status === filters.status
        );
      }

      if (filters.device_type) {
        filtered = filtered.filter(
          (device) => device.device_type === filters.device_type
        );
      }

      if (filters.is_managed !== undefined) {
        filtered = filtered.filter(
          (device) => device.is_managed === filters.is_managed
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (device) =>
            device.ip_address?.toLowerCase().includes(searchTerm) ||
            device.hostname?.toLowerCase().includes(searchTerm) ||
            device.mac_address?.toLowerCase().includes(searchTerm) ||
            device.device_type?.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    },
    [devices]
  );

  // Cargar dispositivos al montar el componente
  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  // Auto-refrescar cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scanning && !loading) {
        loadDevices();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [loadDevices, scanning, loading]);

  return {
    devices,
    loading,
    scanning,
    error,
    stats,
    loadDevices,
    scanNetwork,
    updateDevice,
    deleteDevice,
    getDeviceById,
    filterDevices,
  };
};

export default useDevices;
