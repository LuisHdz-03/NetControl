// Script de prueba para verificar las APIs del speedtest
// Ejecutar en la consola del navegador

async function testSpeedTestAPIs() {
  const baseURL = 'http://localhost:5000';
  
  console.log('🔍 Probando APIs de SpeedTest...');
  
  // Probar debug
  try {
    console.log('📡 Probando /speedtest/debug');
    const debugResponse = await fetch(`${baseURL}/speedtest/debug`);
    const debugData = await debugResponse.json();
    console.log('✅ Debug:', debugData);
  } catch (error) {
    console.error('❌ Error en debug:', error);
  }
  
  // Probar latest
  try {
    console.log('📡 Probando /speedtest/latest');
    const latestResponse = await fetch(`${baseURL}/speedtest/latest`);
    const latestData = await latestResponse.json();
    console.log('📊 Latest:', latestData);
  } catch (error) {
    console.error('❌ Error en latest:', error);
  }
  
  // Probar history
  try {
    console.log('📡 Probando /speedtest/history');
    const historyResponse = await fetch(`${baseURL}/speedtest/history`);
    const historyData = await historyResponse.json();
    console.log('📚 History:', historyData);
  } catch (error) {
    console.error('❌ Error en history:', error);
  }
  
  // Probar averages
  try {
    console.log('📡 Probando /speedtest/averages');
    const avgResponse = await fetch(`${baseURL}/speedtest/averages`);
    const avgData = await avgResponse.json();
    console.log('📈 Averages:', avgData);
  } catch (error) {
    console.error('❌ Error en averages:', error);
  }
}

// Ejecutar las pruebas
testSpeedTestAPIs();