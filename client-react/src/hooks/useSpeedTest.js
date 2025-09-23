import { useState, useEffect, useCallback } from 'react';
import speedTestService from '../services/speedTestService';
import { toast } from 'react-toastify';

export const useSpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [latestTest, setLatestTest] = useState(null);
  const [history, setHistory] = useState([]);
  const [averages, setAverages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar la última prueba al montar el componente
  useEffect(() => {
    loadLatestTest();
    loadHistory();
    loadAverages();
  }, []);

  // Polling para verificar el estado cuando hay una prueba en curso
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        try {
          const status = await speedTestService.getSpeedTestStatus();
          console.log('📊 Estado actual:', status);
          setIsRunning(status.running);
          
          if (!status.running && status.current_test) {
            console.log('🎉 Prueba completada:', status.current_test);
            setCurrentTest(status.current_test);
            setLatestTest(status.current_test);
            loadHistory(); // Recargar historial
            loadAverages(); // Recargar promedios
            
            // Emitir evento personalizado para notificar a otros componentes
            window.dispatchEvent(new CustomEvent('speedTestCompleted', { 
              detail: status.current_test 
            }));
            
            toast.success('Prueba de velocidad completada exitosamente!');
          }
        } catch (error) {
          console.error('❌ Error checking status:', error);
        }
      }, 2000); // Verificar cada 2 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const loadLatestTest = useCallback(async () => {
    try {
      const result = await speedTestService.getLatestSpeedTest();
      console.log('📊 Latest test result:', result);
      if (result.success) {
        setLatestTest(result.data);
      } else {
        console.log('ℹ️ No latest test available:', result.message);
        setLatestTest(null);
      }
    } catch (error) {
      console.error('❌ Error loading latest test:', error);
      setLatestTest(null);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const result = await speedTestService.getSpeedTestHistory(10);
      console.log('📚 History result:', result);
      if (result.success) {
        setHistory(result.data);
        console.log(`📈 Loaded ${result.data.length} history items`);
      } else {
        console.log('ℹ️ No history available:', result.message);
        setHistory([]);
      }
    } catch (error) {
      console.error('❌ Error loading history:', error);
      setHistory([]);
    }
  }, []);

  const loadAverages = useCallback(async () => {
    try {
      const result = await speedTestService.getSpeedAverages(7);
      console.log('📈 Averages result:', result);
      if (result.success) {
        setAverages(result.data);
      } else {
        console.log('ℹ️ No averages available:', result.message);
        setAverages(null);
      }
    } catch (error) {
      console.error('❌ Error loading averages:', error);
      setAverages(null);
    }
  }, []);

  const startTest = useCallback(async () => {
    if (isRunning) {
      toast.warning('Ya hay una prueba de velocidad en curso');
      return;
    }

    try {
      console.log('🚀 Iniciando prueba de velocidad...');
      setLoading(true);
      const result = await speedTestService.startSpeedTest();
      console.log('📡 Respuesta del servidor:', result);
      
      if (result.success) {
        setIsRunning(true);
        setCurrentTest(null);
        toast.info('Iniciando prueba de velocidad...');
        console.log('✅ Prueba iniciada correctamente');
      } else {
        console.error('❌ Error en la respuesta:', result);
        toast.error(result.message || 'Error al iniciar la prueba');
      }
    } catch (error) {
      console.error('❌ Error al iniciar prueba:', error);
      toast.error(error.message || 'Error al iniciar la prueba de velocidad');
    } finally {
      setLoading(false);
    }
  }, [isRunning]);

  const formatSpeed = (speed) => {
    if (!speed) return '0.00';
    return typeof speed === 'number' ? speed.toFixed(2) : parseFloat(speed).toFixed(2);
  };

  const formatPing = (ping) => {
    if (!ping) return '0';
    return typeof ping === 'number' ? Math.round(ping) : Math.round(parseFloat(ping));
  };

  const getSpeedColor = (speed, type = 'download') => {
    const numSpeed = typeof speed === 'number' ? speed : parseFloat(speed || 0);
    
    if (type === 'download') {
      if (numSpeed >= 100) return 'text-green-600';
      if (numSpeed >= 50) return 'text-yellow-600';
      return 'text-red-600';
    } else if (type === 'upload') {
      if (numSpeed >= 50) return 'text-green-600';
      if (numSpeed >= 25) return 'text-yellow-600';
      return 'text-red-600';
    } else if (type === 'ping') {
      if (numSpeed <= 20) return 'text-green-600';
      if (numSpeed <= 50) return 'text-yellow-600';
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    console.log(`🕐 Frontend - String recibido: "${dateString}", Fecha parseada: ${date}, Fecha local: ${date.toLocaleString()}`);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return {
    // Estado
    isRunning,
    currentTest,
    latestTest,
    history,
    averages,
    loading,
    
    // Acciones
    startTest,
    loadLatestTest,
    loadHistory,
    loadAverages,
    
    // Utilidades
    formatSpeed,
    formatPing,
    formatDateTime,
    getSpeedColor
  };
};