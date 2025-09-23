const API_BASE_URL = "http://localhost:5000";

export const devicesService = {
  // Escanear la red en busca de dispositivos
  scanNetwork: async (networkRange = null) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ network_range: networkRange }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error escaneando la red:", error);
      throw error;
    }
  },

  // Obtener todos los dispositivos
  getAllDevices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo dispositivos:", error);
      throw error;
    }
  },

  // Obtener un dispositivo específico
  getDeviceById: async (deviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo dispositivo:", error);
      throw error;
    }
  },

  // Actualizar un dispositivo
  updateDevice: async (deviceId, deviceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error actualizando dispositivo:", error);
      throw error;
    }
  },

  // Eliminar un dispositivo
  deleteDevice: async (deviceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/${deviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error eliminando dispositivo:", error);
      throw error;
    }
  },

  // Obtener el estado de conexión de un dispositivo (ping)
  pingDevice: async (ipAddress) => {
    try {
      // Esta función podría implementarse como un endpoint separado
      // Por ahora, simulamos el ping
      return { success: true, responsive: true };
    } catch (error) {
      console.error("Error haciendo ping al dispositivo:", error);
      throw error;
    }
  },

  // Obtener estadísticas de los dispositivos
  getDeviceStats: async () => {
    try {
      const devices = await devicesService.getAllDevices();

      const stats = {
        total: devices.length,
        active: devices.filter((d) => d.status === "active").length,
        inactive: devices.filter((d) => d.status === "inactive").length,
        managed: devices.filter((d) => d.is_managed).length,
        byType: {},
      };

      // Contar por tipo de dispositivo
      devices.forEach((device) => {
        const type = device.device_type || "unknown";
        stats.byType[type] = (stats.byType[type] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      throw error;
    }
  },

  // Resetear la base de datos de dispositivos
  resetDevicesDatabase: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error reseteando base de datos:", error);
      throw error;
    }
  },

  // Limpiar dispositivos inactivos
  cleanupInactiveDevices: async (maxAgeHours = 24) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/cleanup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_age_hours: maxAgeHours }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error limpiando dispositivos:", error);
      throw error;
    }
  },

  // Obtener estado del sistema
  getSystemStatus: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/status`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error obteniendo estado del sistema:", error);
      throw error;
    }
  },
};

export default devicesService;
