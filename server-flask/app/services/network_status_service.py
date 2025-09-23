import subprocess
import time
import statistics
import requests
from datetime import datetime
from app import db
from app.models.speedtest_model import SpeedTest

class NetworkStatusService:
    def __init__(self):
        self.ping_targets = [
            '8.8.8.8',      # Google DNS
            '1.1.1.1',      # Cloudflare DNS
            '208.67.222.222' # OpenDNS
        ]
        
    def get_network_status(self):
        """Obtiene el estado completo de la red"""
        try:
            # Obtener métricas básicas
            ping_results = self._get_ping_metrics()
            speed_results = self._get_recent_speed_test()
            
            # Calcular estado general
            overall_status = self._calculate_overall_status(ping_results, speed_results)
            
            return {
                'status': overall_status['status'],
                'status_text': overall_status['text'],
                'color': overall_status['color'],
                'isp': speed_results.get('isp', 'No disponible'),
                'details': {
                    'ping': ping_results,
                    'speed': speed_results,
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'diagnostics': self._get_diagnostics(ping_results, speed_results)
                }
            }
        except Exception as e:
            return {
                'status': 'error',
                'status_text': 'ERROR DE CONEXIÓN',
                'color': 'red',
                'details': {
                    'error': str(e),
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }
            }
    
    def _get_ping_metrics(self):
        """Realiza ping a múltiples servidores y calcula métricas"""
        results = {
            'latency_avg': 0,
            'packet_loss': 0,
            'jitter': 0,
            'targets_tested': len(self.ping_targets),
            'successful_targets': 0
        }
        
        latencies = []
        successful_pings = 0
        
        for target in self.ping_targets:
            try:
                # Realizar ping (4 paquetes)
                if subprocess.sys.platform.startswith('win'):
                    cmd = f'ping -n 4 {target}'
                else:
                    cmd = f'ping -c 4 {target}'
                
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
                
                if result.returncode == 0:
                    # Parsear resultados del ping
                    lines = result.stdout.split('\n')
                    target_latencies = []
                    
                    for line in lines:
                        if 'time=' in line or 'tiempo=' in line:
                            try:
                                # Extraer tiempo de respuesta
                                if 'time=' in line:
                                    time_part = line.split('time=')[1].split('ms')[0]
                                elif 'tiempo=' in line:
                                    time_part = line.split('tiempo=')[1].split('ms')[0]
                                
                                latency = float(time_part)
                                target_latencies.append(latency)
                            except:
                                continue
                    
                    if target_latencies:
                        latencies.extend(target_latencies)
                        successful_pings += 1
                        
            except Exception as e:
                print(f"Error pinging {target}: {e}")
                continue
        
        if latencies:
            results['latency_avg'] = round(statistics.mean(latencies), 2)
            results['jitter'] = round(statistics.stdev(latencies) if len(latencies) > 1 else 0, 2)
            results['successful_targets'] = successful_pings
            
            # Calcular pérdida de paquetes
            total_expected = len(self.ping_targets) * 4
            total_received = len(latencies)
            results['packet_loss'] = round(((total_expected - total_received) / total_expected) * 100, 2)
        else:
            results['packet_loss'] = 100
        
        return results
    
    def _get_recent_speed_test(self):
        """Obtiene el speed test más reciente"""
        try:
            latest_test = SpeedTest.query.order_by(SpeedTest.timestamp.desc()).first()
            
            if latest_test:
                # Calcular tiempo transcurrido
                time_diff = datetime.now() - latest_test.timestamp
                hours_ago = time_diff.total_seconds() / 3600
                
                return {
                    'download_speed': latest_test.download_speed,
                    'upload_speed': latest_test.upload_speed,
                    'ping_speed': latest_test.ping,
                    'hours_ago': round(hours_ago, 1),
                    'server': latest_test.server_name or 'Desconocido',
                    'isp': latest_test.isp or 'No disponible',
                    'timestamp': latest_test.timestamp.strftime('%Y-%m-%d %H:%M:%S')
                }
            else:
                return {
                    'download_speed': 0,
                    'upload_speed': 0,
                    'ping_speed': 0,
                    'hours_ago': 999,
                    'server': 'No disponible',
                    'isp': 'No disponible',
                    'timestamp': 'Nunca'
                }
        except Exception as e:
            return {
                'download_speed': 0,
                'upload_speed': 0,
                'ping_speed': 0,
                'hours_ago': 999,
                'server': 'Error',
                'isp': 'Error',
                'timestamp': 'Error',
                'error': str(e)
            }
    
    def _calculate_overall_status(self, ping_results, speed_results):
        """Calcula el estado general de la red"""
        score = 100
        issues = []
        
        # Evaluar latencia
        if ping_results['latency_avg'] > 100:
            score -= 30
            issues.append('Alta latencia')
        elif ping_results['latency_avg'] > 50:
            score -= 15
            issues.append('Latencia moderada')
        
        # Evaluar pérdida de paquetes
        if ping_results['packet_loss'] > 5:
            score -= 25
            issues.append('Pérdida de paquetes significativa')
        elif ping_results['packet_loss'] > 1:
            score -= 10
            issues.append('Pérdida de paquetes menor')
        
        # Evaluar velocidad (asumiendo 100 Mbps contratados)
        contracted_speed = 100  # Mbps
        if speed_results['download_speed'] > 0:
            speed_percentage = (speed_results['download_speed'] / contracted_speed) * 100
            
            if speed_percentage < 50:
                score -= 20
                issues.append('Velocidad muy baja')
            elif speed_percentage < 80:
                score -= 10
                issues.append('Velocidad por debajo de lo esperado')
        
        # Evaluar antigüedad del speed test
        if speed_results['hours_ago'] > 24:
            score -= 5
            issues.append('Datos de velocidad desactualizados')
        
        # Determinar estado basado en puntuación
        if score >= 85:
            return {
                'status': 'excellent',
                'text': 'EXCELENTE',
                'color': 'green'
            }
        elif score >= 70:
            return {
                'status': 'good',
                'text': 'BUENA',
                'color': 'green'
            }
        elif score >= 50:
            return {
                'status': 'fair',
                'text': 'REGULAR',
                'color': 'yellow'
            }
        elif score >= 30:
            return {
                'status': 'poor',
                'text': 'MALA',
                'color': 'orange'
            }
        else:
            return {
                'status': 'critical',
                'text': 'CRÍTICA',
                'color': 'red'
            }
    
    def _get_diagnostics(self, ping_results, speed_results):
        """Genera diagnósticos y sugerencias"""
        diagnostics = {
            'issues': [],
            'suggestions': [],
            'summary': ''
        }
        
        # Analizar problemas de latencia
        if ping_results['latency_avg'] > 100:
            diagnostics['issues'].append('Latencia muy alta')
            diagnostics['suggestions'].append('Verificar conexión física y reiniciar router')
        
        # Analizar pérdida de paquetes
        if ping_results['packet_loss'] > 1:
            diagnostics['issues'].append(f'Pérdida de paquetes: {ping_results["packet_loss"]}%')
            diagnostics['suggestions'].append('Revisar cables de red y interferencias')
        
        # Analizar velocidad
        if speed_results['download_speed'] > 0 and speed_results['download_speed'] < 50:
            diagnostics['issues'].append('Velocidad de descarga muy baja')
            diagnostics['suggestions'].append('Contactar proveedor de internet o realizar nuevo speed test')
        
        # Generar resumen
        if not diagnostics['issues']:
            diagnostics['summary'] = 'Red funcionando correctamente'
        else:
            diagnostics['summary'] = f'{len(diagnostics["issues"])} problema(s) detectado(s)'
        
        return diagnostics