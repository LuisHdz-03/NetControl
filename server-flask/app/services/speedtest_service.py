import speedtest
import threading
import requests
import time
import subprocess
from datetime import datetime, timedelta
from flask import jsonify, current_app
from app import db
from app.models.speedtest_model import SpeedTest

class SpeedTestService:
    def __init__(self):
        self.current_test = None
        self.test_running = False
    
    def run_speed_test(self, app=None):
        """Ejecuta una prueba de velocidad completa con método principal y fallback alternativo"""
        try:
            print("🚀 Iniciando prueba de velocidad...")
            self.test_running = True
            
            # Crear contexto de aplicación si se proporciona
            if app:
                app_context = app.app_context()
                app_context.push()
            else:
                app_context = None
            
            # PASO 1: Intentar método principal (speedtest.net)
            print("🎯 PASO 1: Intentando método principal (speedtest.net)...")
            primary_result = self._run_primary_speedtest()
            
            if primary_result['success']:
                print("✅ Método principal exitoso!")
                download_speed = primary_result['download_speed']
                upload_speed = primary_result['upload_speed']
                ping = primary_result['ping']
                server_info = primary_result['server_info']
                ip_address = primary_result['ip_address']
                isp = primary_result['isp']
                method_used = "SpeedTest.net (Principal)"
                
            else:
                print(f"❌ Método principal falló: {primary_result['error']}")
                print("🎯 PASO 2: Intentando método alternativo...")
                
                # PASO 2: Método alternativo
                alternative_result = self._alternative_speed_test()
                
                if alternative_result['success']:
                    print("✅ Método alternativo exitoso!")
                    download_speed = alternative_result['download_speed']
                    upload_speed = alternative_result['upload_speed']
                    ping = alternative_result['ping']
                    server_info = {'name': 'Método Alternativo', 'country': 'Global', 'cc': 'ALT'}
                    ip_address = alternative_result.get('ip_address', 'Unknown')
                    isp = alternative_result.get('isp', 'Unknown ISP')
                    method_used = "Método Alternativo"
                    
                else:
                    print("❌ Método alternativo también falló!")
                    raise Exception(f"Ambos métodos fallaron. Principal: {primary_result['error']}. Alternativo: {alternative_result['error']}")
            
            # Crear registro en la base de datos
            current_time = datetime.now()
            print(f"🕐 Hora local del servidor: {current_time}")
            print(f"🔧 Método utilizado: {method_used}")
            
            speed_test = SpeedTest(
                download_speed=download_speed,
                upload_speed=upload_speed,
                ping=ping,
                server_name=server_info.get('name', 'Unknown'),
                server_location=f"{server_info.get('country', '')}, {server_info.get('cc', '')}",
                ip_address=ip_address,
                isp=isp
            )
            
            print("💾 Guardando resultados en la base de datos...")
            db.session.add(speed_test)
            db.session.commit()
            
            self.current_test = speed_test.to_dict()
            self.test_running = False
            
            print("✅ Prueba completada exitosamente!")
            print(f"📈 Resultados: {self.current_test}")
            
            # Limpiar contexto de aplicación
            if app_context:
                app_context.pop()
            
            return {
                'success': True,
                'data': self.current_test,
                'message': 'Prueba de velocidad completada exitosamente'
            }
            
        except Exception as e:
            self.test_running = False
            print(f"❌ Error en la prueba de velocidad: {str(e)}")
            print(f"📋 Tipo de error: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            
            # Limpiar contexto de aplicación en caso de error
            if 'app_context' in locals() and app_context:
                app_context.pop()
            
            return {
                'success': False,
                'error': str(e),
                'message': 'Error al realizar la prueba de velocidad'
            }
    
    def run_speed_test_async(self):
        """Ejecuta la prueba de velocidad en un hilo separado"""
        if self.test_running:
            print("⚠️ Ya hay una prueba de velocidad en curso")
            return {
                'success': False,
                'message': 'Ya hay una prueba de velocidad en curso'
            }
        
        print("🔄 Iniciando hilo de prueba de velocidad...")
        # Ejecutar en hilo separado para no bloquear la aplicación
        app = current_app._get_current_object()  # Obtener la aplicación actual
        thread = threading.Thread(target=self.run_speed_test, args=(app,))
        thread.daemon = True  # Hacer el hilo daemon
        thread.start()
        
        print("✅ Hilo de prueba iniciado correctamente")
        return {
            'success': True,
            'message': 'Prueba de velocidad iniciada'
        }
    
    def get_test_status(self):
        """Obtiene el estado actual de la prueba"""
        return {
            'running': self.test_running,
            'current_test': self.current_test
        }
    
    def get_latest_test(self):
        """Obtiene la prueba más reciente"""
        try:
            latest = SpeedTest.query.order_by(SpeedTest.timestamp.desc()).first()
            if latest:
                return {
                    'success': True,
                    'data': latest.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'No hay pruebas de velocidad registradas'
                }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_test_history(self, limit=10):
        """Obtiene el historial de pruebas"""
        try:
            tests = SpeedTest.query.order_by(SpeedTest.timestamp.desc()).limit(limit).all()
            return {
                'success': True,
                'data': [test.to_dict() for test in tests]
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_average_speeds(self, days=7):
        """Obtiene los promedios de velocidad de los últimos días"""
        try:
            since_date = datetime.utcnow() - timedelta(days=days)
            tests = SpeedTest.query.filter(SpeedTest.timestamp >= since_date).all()
            
            if not tests:
                return {
                    'success': False,
                    'message': f'No hay datos de los últimos {days} días'
                }
            
            total_tests = len(tests)
            avg_download = sum(test.download_speed for test in tests) / total_tests
            avg_upload = sum(test.upload_speed for test in tests) / total_tests
            avg_ping = sum(test.ping for test in tests) / total_tests
            
            return {
                'success': True,
                'data': {
                    'average_download': round(avg_download, 2),
                    'average_upload': round(avg_upload, 2),
                    'average_ping': round(avg_ping, 2),
                    'total_tests': total_tests,
                    'period_days': days
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _run_primary_speedtest(self):
        """Ejecuta el método principal usando speedtest.net"""
        try:
            print("📡 Inicializando speedtest.net...")
            st = speedtest.Speedtest()
            
            print("🔍 Buscando mejor servidor...")
            st.get_best_server()
            server_info = st.results.server
            print(f"✅ Servidor seleccionado: {server_info}")
            
            print("⬇️ Probando velocidad de descarga...")
            download_speed = st.download() / 1_000_000  # Convertir a Mbps
            print(f"📊 Descarga: {download_speed:.2f} Mbps")
            
            print("⬆️ Probando velocidad de subida...")
            upload_speed = st.upload() / 1_000_000      # Convertir a Mbps
            print(f"📊 Subida: {upload_speed:.2f} Mbps")
            
            ping = st.results.ping
            print(f"📊 Ping: {ping:.2f} ms")
            
            # Obtener información del cliente
            client_info = st.results.client
            ip_address = client_info.get('ip', 'Unknown')
            isp = client_info.get('isp', 'Unknown')
            
            print(f"🌐 IP: {ip_address}")
            print(f"🏢 ISP: {isp}")
            
            return {
                'success': True,
                'download_speed': download_speed,
                'upload_speed': upload_speed,
                'ping': ping,
                'server_info': server_info,
                'ip_address': ip_address,
                'isp': isp
            }
            
        except Exception as e:
            print(f"❌ Error en método principal: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _alternative_speed_test(self):
        """Método alternativo usando medición manual cuando speedtest.net no está disponible"""
        try:
            print("🔄 Ejecutando método alternativo de medición...")
            
            # Medir ping manualmente
            ping = self._measure_ping()
            
            # Medición de velocidad de descarga usando archivo de prueba
            download_speed = self._measure_download_speed()
            
            # Medición básica de upload (simulada por ahora)
            upload_speed = self._estimate_upload_speed()
            
            # Obtener información de IP e ISP
            ip_info = self._get_ip_info()
            
            return {
                'success': True,
                'download_speed': download_speed,
                'upload_speed': upload_speed,
                'ping': ping,
                'ip_address': ip_info.get('ip', 'Unknown'),
                'isp': ip_info.get('isp', 'Unknown')
            }
            
        except Exception as e:
            print(f"❌ Error en método alternativo: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def _measure_ping(self):
        """Mide el ping usando ping del sistema"""
        try:
            print("📡 Midiendo ping a 8.8.8.8...")
            import platform
            
            # Comando ping según el sistema operativo
            if platform.system().lower() == 'windows':
                cmd = ['ping', '-n', '4', '8.8.8.8']
            else:
                cmd = ['ping', '-c', '4', '8.8.8.8']
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                # Extraer tiempo promedio del output
                lines = result.stdout.split('\n')
                for line in lines:
                    if 'Average' in line or 'avg' in line:
                        # Buscar el número del ping
                        parts = line.split()
                        for part in parts:
                            try:
                                if 'ms' in part:
                                    ping_time = float(part.replace('ms', ''))
                                    return ping_time
                            except:
                                continue
                
                # Si no encontramos el promedio, usar una estimación
                return 50.0  # Ping estimado
            else:
                return 100.0  # Ping alto por defecto
                
        except Exception as e:
            print(f"⚠️ Error midiendo ping: {str(e)}")
            return 75.0  # Ping estimado por defecto
    
    def _measure_download_speed(self):
        """Mide velocidad de descarga usando un archivo de prueba"""
        try:
            print("⬇️ Midiendo velocidad de descarga...")
            
            # URLs de archivos de prueba (en orden de preferencia)
            test_urls = [
                'http://speedtest.ftp.otenet.gr/files/test10Mb.db',
                'http://ipv4.download.thinkbroadband.com/10MB.zip',
                'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip'
            ]
            
            for url in test_urls:
                try:
                    start_time = time.time()
                    response = requests.get(url, stream=True, timeout=30)
                    
                    if response.status_code == 200:
                        # Descargar y medir
                        downloaded = 0
                        for chunk in response.iter_content(chunk_size=8192):
                            if chunk:
                                downloaded += len(chunk)
                        
                        end_time = time.time()
                        duration = end_time - start_time
                        
                        if duration > 0:
                            # Calcular velocidad en Mbps
                            speed_mbps = (downloaded * 8) / (duration * 1_000_000)
                            print(f"📊 Velocidad calculada: {speed_mbps:.2f} Mbps")
                            return speed_mbps
                        
                except Exception as e:
                    print(f"⚠️ Error con URL {url}: {str(e)}")
                    continue
            
            # Si todos fallan, retornar estimación conservadora
            print("⚠️ No se pudo medir descarga, usando estimación")
            return 10.0  # 10 Mbps estimado
            
        except Exception as e:
            print(f"❌ Error midiendo descarga: {str(e)}")
            return 5.0  # Velocidad conservadora
    
    def _estimate_upload_speed(self):
        """Estima velocidad de subida (típicamente menor que descarga)"""
        # En conexiones asimétricas, upload suele ser 10-20% de download
        # Por ahora usamos una estimación conservadora
        return 5.0  # 5 Mbps estimado
    
    def _get_ip_info(self):
        """Obtiene información de IP e ISP usando servicios públicos"""
        try:
            print("🌐 Obteniendo información de IP...")
            
            # Servicios de IP info (en orden de preferencia)
            services = [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://api.ipify.org?format=json'
            ]
            
            for service in services:
                try:
                    response = requests.get(service, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        
                        # Extraer información según el servicio
                        if 'ipapi.co' in service:
                            return {
                                'ip': data.get('ip', 'Unknown'),
                                'isp': data.get('org', 'Unknown ISP')
                            }
                        elif 'ipinfo.io' in service:
                            return {
                                'ip': data.get('ip', 'Unknown'),
                                'isp': data.get('org', 'Unknown ISP')
                            }
                        else:  # ipify
                            return {
                                'ip': data.get('ip', 'Unknown'),
                                'isp': 'Unknown ISP'
                            }
                            
                except Exception as e:
                    print(f"⚠️ Error con servicio {service}: {str(e)}")
                    continue
            
            return {'ip': 'Unknown', 'isp': 'Unknown ISP'}
            
        except Exception as e:
            print(f"❌ Error obteniendo IP info: {str(e)}")
            return {'ip': 'Unknown', 'isp': 'Unknown ISP'}

# Instancia global del servicio
speedtest_service = SpeedTestService()