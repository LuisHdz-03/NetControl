import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState({
        status: 'loading',
        status_text: 'VERIFICANDO...',
        color: 'gray',
        details: null,
        loading: true,
        error: null
    });

    const [networkDetails, setNetworkDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Obtener estado básico de la red
    const fetchNetworkStatus = async () => {
        try {
            setNetworkStatus(prev => ({ ...prev, loading: true, error: null }));
            
            const response = await axios.get('http://localhost:5000/network-status');
            
            if (response.data.success) {
                setNetworkStatus({
                    ...response.data.data,
                    loading: false,
                    error: null
                });
            } else {
                throw new Error(response.data.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error fetching network status:', error);
            setNetworkStatus({
                status: 'error',
                status_text: 'ERROR DE CONEXIÓN',
                color: 'red',
                details: null,
                loading: false,
                error: error.message
            });
        }
    };

    // Obtener detalles completos de la red
    const fetchNetworkDetails = async () => {
        try {
            setDetailsLoading(true);
            
            const response = await axios.get('http://localhost:5000/network-status/details');
            
            if (response.data.success) {
                setNetworkDetails(response.data.data);
            } else {
                throw new Error(response.data.error || 'Error obteniendo detalles');
            }
        } catch (error) {
            console.error('Error fetching network details:', error);
            setNetworkDetails({
                error: error.message
            });
        } finally {
            setDetailsLoading(false);
        }
    };

    // Refrescar estado de red
    const refreshNetworkStatus = () => {
        fetchNetworkStatus();
    };

    // Obtener estado inicial al montar el componente
    useEffect(() => {
        fetchNetworkStatus();
        
        // Actualizar cada 30 segundos
        const interval = setInterval(fetchNetworkStatus, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Funciones de utilidad para determinar estilos
    const getStatusColor = () => {
        switch (networkStatus.color) {
            case 'green':
                return 'text-green-600';
            case 'yellow':
                return 'text-yellow-600';
            case 'orange':
                return 'text-orange-600';
            case 'red':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = () => {
        switch (networkStatus.status) {
            case 'excellent':
            case 'good':
                return '🟢';
            case 'fair':
                return '🟡';
            case 'poor':
                return '🟠';
            case 'critical':
            case 'error':
                return '🔴';
            default:
                return '⚪';
        }
    };

    return {
        networkStatus,
        networkDetails,
        detailsLoading,
        fetchNetworkStatus,
        fetchNetworkDetails,
        refreshNetworkStatus,
        getStatusColor,
        getStatusIcon
    };
};