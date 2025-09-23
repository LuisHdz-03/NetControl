import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeedTest from '../components/SpeedTest';
import SpeedTestChart from '../components/SpeedTestChart';
import NetworkDetailsModal from '../components/NetworkDetailsModal';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useFallas } from '../hooks/useFailures';
import useDevices from '../hooks/useDevices';
import { FiRefreshCw } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    networkStatus, 
    networkDetails, 
    detailsLoading, 
    fetchNetworkDetails, 
    refreshNetworkStatus, 
    getStatusColor, 
    getStatusIcon 
  } = useNetworkStatus();
  const { fallas } = useFallas();
  const { devices, stats } = useDevices();

  const handleShowDetails = async () => {
    setIsModalOpen(true);
    await fetchNetworkDetails();
  };

  const handleNavigateToDevices = () => {
    navigate('/dispositivos');
  };

  const handleNavigateToFailures = () => {
    navigate('/failures');
  };

  return (
    <main className="container mx-auto p-4 animacion lineaSeparadora font-sans">
      <div className="text-center my-4">
        <h1 className="text-3xl font-bold text-white">Bienvenido a la página de Inicio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta de ancho de banda */}
        <div className="flex justify-center">
          <SpeedTest />
        </div>

        {/* Tarjeta de estado de la red */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xl font-semibold">ESTADO DE LA RED</h5>
                <button 
                  onClick={refreshNetworkStatus}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={networkStatus.loading}
                >
                  <FiRefreshCw className={networkStatus.loading ? 'animate-spin' : ''} size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">{getStatusIcon()}</span>
                <p className={`${getStatusColor()} font-semibold`}>
                  {networkStatus.status_text}
                </p>
              </div>
              
              {networkStatus.details && (
                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <p>Ping: {networkStatus.details.ping?.latency_avg || '--'} ms</p>
                  <p>Pérdida: {networkStatus.details.ping?.packet_loss || '--'}%</p>
                  <p>ISP: {networkStatus.isp || 'No disponible'}</p>
                </div>
              )}
              
              <button 
                onClick={handleShowDetails}
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de mantenimiento */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">MANTENIMIENTO</h5>
              <div className="mb-4">
                <p className="text-3xl font-bold text-red-600">{fallas?.length || 0}</p>
                <p className="text-gray-600 text-sm">Fallas registradas</p>
              </div>
              <button 
                onClick={handleNavigateToFailures}
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Ver Fallas
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de dispositivos conectados */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">DISPOSITIVOS CONECTADOS</h5>
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-600">{stats?.active || 0}</p>
                <p className="text-gray-600 text-sm">de {stats?.total || 0} dispositivos</p>
              </div>
              <button 
                onClick={handleNavigateToDevices}
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900 transition-colors cursor-pointer"
              >
                Ver Dispositivos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico del historial de velocidad */}
      <div className="mt-8 flex justify-center">
        <SpeedTestChart />
      </div>

      {/* Modal de detalles de red */}
      <NetworkDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={networkDetails}
        loading={detailsLoading}
      />
    </main>
  );
};

export default Home;
