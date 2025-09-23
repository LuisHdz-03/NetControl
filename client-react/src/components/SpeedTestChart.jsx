import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSpeedTest } from '../hooks/useSpeedTest';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SpeedTestChart = () => {
  const { history, loadHistory } = useSpeedTest();
  const [chartData, setChartData] = useState(null);

  // Escuchar eventos de speed test completado
  useEffect(() => {
    const handleSpeedTestCompleted = () => {
      console.log('📊 SpeedTestChart - Speed test completed, refreshing chart...');
      // El hook ya actualiza automáticamente el history, pero podemos forzar un refresh
      if (loadHistory) {
        loadHistory();
      }
    };

    window.addEventListener('speedTestCompleted', handleSpeedTestCompleted);
    
    return () => {
      window.removeEventListener('speedTestCompleted', handleSpeedTestCompleted);
    };
  }, [loadHistory]);

  useEffect(() => {
    console.log('📊 SpeedTestChart - history:', history);
    if (history && history.length > 0) {
      console.log(`📈 Rendering chart with ${history.length} data points`);
      // Ordenar por fecha (más antigua a más reciente para el gráfico)
      const sortedHistory = [...history].reverse();
      
      const labels = sortedHistory.map(test => {
        const date = new Date(test.timestamp);
        return date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      });

      const downloadData = sortedHistory.map(test => test.download_speed);
      const uploadData = sortedHistory.map(test => test.upload_speed);

      setChartData({
        labels,
        datasets: [
          {
            label: 'Descarga (Mbps)',
            data: downloadData,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.1,
          },
          {
            label: 'Subida (Mbps)',
            data: uploadData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.1,
          }
        ],
      });
      console.log('✅ Chart data created successfully');
    } else {
      console.log('ℹ️ No history data available for chart');
      setChartData(null);
    }
  }, [history]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Historial de Velocidad de Internet',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Velocidad (Mbps)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tiempo'
        }
      }
    },
  };

  if (!chartData) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Historial de Velocidad</h3>
        <div className="flex items-center justify-center h-80 text-gray-500">
          No hay datos suficientes para mostrar el gráfico
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">Historial de Velocidad</h3>
      <div className="h-80 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SpeedTestChart;