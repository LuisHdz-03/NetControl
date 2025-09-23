import React, { useState } from "react";
import {
  FiWifi,
  FiRefreshCw,
  FiMonitor,
  FiServer,
  FiSmartphone,
  FiHardDrive,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import useDevices from "../hooks/useDevices";

const Dispositivos = () => {
  const {
    devices,
    loading,
    scanning,
    error,
    stats,
    scanNetwork,
    updateDevice,
    deleteDevice,
    filterDevices,
  } = useDevices();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Filtrar dispositivos según los criterios
  const filteredDevices = filterDevices({
    search: searchTerm,
    status: statusFilter || undefined,
    device_type: typeFilter || undefined,
  });

  // Obtener icono según el tipo de dispositivo
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case "router":
      case "network_device":
        return <FiWifi className="h-6 w-6" />;
      case "computer":
      case "windows_computer":
        return <FiMonitor className="h-6 w-6" />;
      case "web_server":
      case "linux_server":
        return <FiServer className="h-6 w-6" />;
      case "phone":
      case "mobile":
        return <FiSmartphone className="h-6 w-6" />;
      default:
        return <FiHardDrive className="h-6 w-6" />;
    }
  };

  // Obtener color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Obtener color de fondo para la tarjeta según el estado
  const getCardBgColor = (status) => {
    switch (status) {
      case "active":
        return "border-green-200 bg-green-50";
      case "inactive":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Formatear puertos abiertos
  const formatPorts = (portsString) => {
    if (!portsString) return "Ninguno";
    try {
      const ports = JSON.parse(portsString);
      return ports.length > 0 ? ports.join(", ") : "Ninguno";
    } catch {
      return "Error al parsear";
    }
  };

  return (
    <main className="container mx-auto p-4 animacion lineaSeparadora font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dispositivos de Red
          </h1>
        </div>

        <button
          onClick={() => scanNetwork()}
          disabled={scanning || loading}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            scanning || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#168F27] hover:bg-[#0f6b1f] text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <FiRefreshCw
            className={`h-5 w-5 mr-2 ${scanning ? "animate-spin" : ""}`}
          />
          {scanning ? "Escaneando..." : "Escanear Red"}
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <FiWifi className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <div className="h-3 w-3 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.inactive}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <FiMonitor className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Gestionados</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.managed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por IP, hostname, MAC o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#168F27] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#168F27] focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#168F27] focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="router">Router</option>
              <option value="computer">Computadora</option>
              <option value="web_server">Servidor Web</option>
              <option value="network_device">Dispositivo de Red</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de dispositivos */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && !scanning && (
        <div className="flex justify-center items-center py-8">
          <FiRefreshCw className="animate-spin h-8 w-8 text-[#168F27] mr-2" />
          <span className="text-gray-600">Cargando dispositivos...</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${getCardBgColor(
              device.status
            )}`}
          >
            {/* Header de la tarjeta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-lg mr-3 ${
                    device.status === "active" ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {getDeviceIcon(device.device_type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {device.hostname || device.ip_address}
                  </h3>
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      device.status
                    )}`}
                  >
                    ● {device.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              {device.is_managed && (
                <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Gestionado
                </div>
              )}
            </div>

            {/* Información del dispositivo */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">IP:</span>
                <span className="font-mono">{device.ip_address}</span>
              </div>

              {device.mac_address && (
                <div className="flex justify-between">
                  <span className="font-medium">MAC:</span>
                  <span className="font-mono text-xs">
                    {device.mac_address}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Tipo:</span>
                <span className="capitalize">
                  {device.device_type || "Desconocido"}
                </span>
              </div>

              {device.manufacturer && (
                <div className="flex justify-between">
                  <span className="font-medium">Fabricante:</span>
                  <span>{device.manufacturer}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-medium">Puertos:</span>
                <span className="text-xs">
                  {formatPorts(device.open_ports)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Última vez visto:</span>
                <span className="text-xs">{formatDate(device.last_seen)}</span>
              </div>
            </div>

            {/* Notas si existen */}
            {device.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">{device.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay dispositivos */}
      {!loading && filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <FiWifi className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {devices.length === 0
              ? "No hay dispositivos"
              : "No se encontraron dispositivos"}
          </h3>
          <p className="text-gray-500 mb-4">
            {devices.length === 0
              ? 'Haz clic en "Escanear Red" para descubrir dispositivos conectados'
              : "Intenta cambiar los filtros de búsqueda"}
          </p>
          {devices.length === 0 && (
            <button
              onClick={() => scanNetwork()}
              disabled={scanning}
              className="bg-[#168F27] hover:bg-[#0f6b1f] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Escanear Red
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default Dispositivos;
