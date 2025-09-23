import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

class SpeedTestService {
  async startSpeedTest() {
    try {
      // Intentar primero con el servicio oficial
      const response = await axios.post(`${API_BASE_URL}/speedtest/start`);
      return response.data;
    } catch (error) {
      console.warn('Servicio oficial falló, intentando con servicio personalizado...');
      try {
        // Fallback automático al servicio personalizado
        const fallbackResponse = await axios.post(`${API_BASE_URL}/speedtest/start-custom`);
        return fallbackResponse.data;
      } catch (fallbackError) {
        throw new Error(fallbackError.response?.data?.message || 'Error al iniciar la prueba');
      }
    }
  }

  async getSpeedTestStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/speedtest/status`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el estado');
    }
  }

  async getLatestSpeedTest() {
    try {
      const response = await axios.get(`${API_BASE_URL}/speedtest/latest`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener la última prueba');
    }
  }

  async getSpeedTestHistory(limit = 10) {
    try {
      const response = await axios.get(`${API_BASE_URL}/speedtest/history?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener el historial');
    }
  }

  async getSpeedAverages(days = 7) {
    try {
      const response = await axios.get(`${API_BASE_URL}/speedtest/averages?days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener los promedios');
    }
  }
}

export default new SpeedTestService();