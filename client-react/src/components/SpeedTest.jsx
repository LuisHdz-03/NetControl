import React from 'react';
import { FaPlay, FaSpinner, FaWifi, FaArrowDown, FaArrowUp, FaClock } from 'react-icons/fa';
import { useSpeedTest } from '../hooks/useSpeedTest';

const SpeedTest = () => {
  const {
    isRunning,
    latestTest,
    loading,
    startTest,
    formatSpeed,
    formatPing,
    formatDateTime,
    getSpeedColor
  } = useSpeedTest();

  return (
    <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
      <div className="p-6 text-center flex flex-col flex-1">
        <div className="flex items-center justify-center mb-2">
          <FaWifi className="mr-2 text-blue-600" />
          <h5 className="text-xl font-semibold">ANCHO DE BANDA</h5>
        </div>
        
        {/* Resultados de la prueba */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaArrowDown className="text-green-600 mr-2" />
              <span>Descarga:</span>
            </div>
            <span className={`font-semibold ${getSpeedColor(latestTest?.download_speed, 'download')}`}>
              {latestTest ? formatSpeed(latestTest.download_speed) : '-'} Mbps
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaArrowUp className="text-blue-600 mr-2" />
              <span>Subida:</span>
            </div>
            <span className={`font-semibold ${getSpeedColor(latestTest?.upload_speed, 'upload')}`}>
              {latestTest ? formatSpeed(latestTest.upload_speed) : '-'} Mbps
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaClock className="text-orange-600 mr-2" />
              <span>Ping:</span>
            </div>
            <span className={`font-semibold ${getSpeedColor(latestTest?.ping, 'ping')}`}>
              {latestTest ? formatPing(latestTest.ping) : '-'} ms
            </span>
          </div>
        </div>

        {/* Información adicional */}
        {latestTest && (
          <div className="text-xs text-gray-600 mb-4">
            <p>Servidor: {latestTest.server_name}</p>
            <p>ISP: {latestTest.isp}</p>
            <p>Última prueba: {formatDateTime(latestTest.timestamp)}</p>
          </div>
        )}

        {/* Barra de progreso cuando está corriendo */}
        {isRunning && (
          <div className="mb-4">
            <div className="flex items-center justify-center mb-2">
              <FaSpinner className="animate-spin mr-2 text-blue-600" />
              <span className="text-sm">Ejecutando prueba...</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}

        {/* Botón de iniciar prueba */}
        <button 
          className={`flex items-center justify-center py-2 px-4 rounded mt-auto transition-colors cursor-pointer ${
            isRunning || loading
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          onClick={startTest}
          disabled={isRunning || loading}
        >
          {isRunning ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Probando...
            </>
          ) : loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Iniciando...
            </>
          ) : (
            <>
              <FaPlay className="mr-2" />
              Iniciar Prueba
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SpeedTest;