import React from 'react';
import { FiX, FiWifi, FiActivity, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const NetworkDetailsModal = ({ isOpen, onClose, details, loading }) => {
    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-lg">Obteniendo detalles...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!details || details.error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Error</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <FiX size={24} />
                        </button>
                    </div>
                    <div className="text-center py-8">
                        <FiAlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                        <p className="text-red-600">No se pudieron obtener los detalles de la red</p>
                        <p className="text-gray-500 text-sm mt-2">{details?.error || 'Error desconocido'}</p>
                    </div>
                </div>
            </div>
        );
    }

    const getLatencyStatus = (latency) => {
        if (latency < 50) return { text: 'Excelente', color: 'text-green-600' };
        if (latency < 100) return { text: 'Buena', color: 'text-yellow-600' };
        return { text: 'Alta', color: 'text-red-600' };
    };

    const getSpeedStatus = (speed, type = 'download') => {
        const expectedSpeed = type === 'download' ? 100 : 50; // Mbps esperados
        const percentage = (speed / expectedSpeed) * 100;
        
        if (percentage >= 80) return { text: 'Excelente', color: 'text-green-600' };
        if (percentage >= 50) return { text: 'Aceptable', color: 'text-yellow-600' };
        return { text: 'Baja', color: 'text-red-600' };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <div className="flex items-center gap-3">
                        <FiWifi className="text-blue-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800">Detalles del Estado de Red</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Estado General */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`text-3xl ${details.color === 'green' ? 'text-green-600' : 
                                details.color === 'yellow' ? 'text-yellow-600' : 
                                details.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                                {details.status === 'excellent' || details.status === 'good' ? '🟢' :
                                 details.status === 'fair' ? '🟡' :
                                 details.status === 'poor' ? '🟠' : '🔴'}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Estado: {details.status_text}</h3>
                                <p className="text-gray-600">Última actualización: {details.details?.timestamp}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Métricas de Conectividad */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiActivity className="text-blue-600" />
                                Métricas de Conectividad
                            </h4>
                            
                            {details.details?.ping && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Latencia Promedio:</span>
                                        <div className="text-right">
                                            <span className="font-semibold">{details.details.ping.latency_avg} ms</span>
                                            <span className={`ml-2 text-sm ${getLatencyStatus(details.details.ping.latency_avg).color}`}>
                                                {getLatencyStatus(details.details.ping.latency_avg).text}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Pérdida de Paquetes:</span>
                                        <span className={`font-semibold ${details.details.ping.packet_loss > 1 ? 'text-red-600' : 'text-green-600'}`}>
                                            {details.details.ping.packet_loss}%
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Jitter:</span>
                                        <span className="font-semibold">{details.details.ping.jitter} ms</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Servidores Exitosos:</span>
                                        <span className="font-semibold">{details.details.ping.successful_targets}/{details.details.ping.targets_tested}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Velocidades */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiClock className="text-green-600" />
                                Velocidades de Internet
                            </h4>
                            
                            {details.details?.speed && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Descarga:</span>
                                        <div className="text-right">
                                            <span className="font-semibold">{details.details.speed.download_speed} Mbps</span>
                                            <span className={`ml-2 text-sm ${getSpeedStatus(details.details.speed.download_speed, 'download').color}`}>
                                                {getSpeedStatus(details.details.speed.download_speed, 'download').text}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Subida:</span>
                                        <div className="text-right">
                                            <span className="font-semibold">{details.details.speed.upload_speed} Mbps</span>
                                            <span className={`ml-2 text-sm ${getSpeedStatus(details.details.speed.upload_speed, 'upload').color}`}>
                                                {getSpeedStatus(details.details.speed.upload_speed, 'upload').text}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Ping del Speed Test:</span>
                                        <span className="font-semibold">{details.details.speed.ping_speed} ms</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Servidor:</span>
                                        <span className="font-semibold">{details.details.speed.server}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Hace:</span>
                                        <span className={`font-semibold ${details.details.speed.hours_ago > 24 ? 'text-red-600' : 'text-green-600'}`}>
                                            {details.details.speed.hours_ago < 1 ? 'Menos de 1 hora' : `${details.details.speed.hours_ago} horas`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Diagnósticos */}
                    {details.details?.diagnostics && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiAlertTriangle className="text-orange-600" />
                                Diagnóstico
                            </h4>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium mb-3">{details.details.diagnostics.summary}</p>
                                
                                {details.details.diagnostics.issues.length > 0 && (
                                    <div className="mb-4">
                                        <h5 className="font-medium text-red-600 mb-2">Problemas Detectados:</h5>
                                        <ul className="list-disc list-inside space-y-1">
                                            {details.details.diagnostics.issues.map((issue, index) => (
                                                <li key={index} className="text-red-700">{issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {details.details.diagnostics.suggestions.length > 0 && (
                                    <div>
                                        <h5 className="font-medium text-blue-600 mb-2">Sugerencias:</h5>
                                        <ul className="list-disc list-inside space-y-1">
                                            {details.details.diagnostics.suggestions.map((suggestion, index) => (
                                                <li key={index} className="text-blue-700">{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recomendaciones */}
                    {details.recommendations && details.recommendations.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FiCheckCircle className="text-green-600" />
                                Recomendaciones
                            </h4>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {details.recommendations.map((recommendation, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-green-600 mt-1">•</span>
                                            <span className="text-green-800">{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Historial de Speed Tests */}
                    {details.history && details.history.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4">Historial Reciente</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2">Fecha/Hora</th>
                                                <th className="text-left py-2">Descarga</th>
                                                <th className="text-left py-2">Subida</th>
                                                <th className="text-left py-2">Ping</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.history.slice(0, 5).map((test, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-2">{new Date(test.timestamp).toLocaleString()}</td>
                                                    <td className="py-2">{test.download} Mbps</td>
                                                    <td className="py-2">{test.upload} Mbps</td>
                                                    <td className="py-2">{test.ping} ms</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NetworkDetailsModal;