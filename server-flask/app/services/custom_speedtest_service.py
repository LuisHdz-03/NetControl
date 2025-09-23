import time
import requests
import threading
from datetime import datetime, timedelta
from flask import current_app
from app import db
from app.models.speedtest_model import SpeedTest

class CustomSpeedTestService:
    def __init__(self):
        self.current_test = None
        self.test_running = False
        # URLs de archivos de prueba de diferentes tamaños
        self.test_files = {
            'small': 'https://httpbin.org/bytes/1048576',    # 1MB
            'medium': 'https://httpbin.org/bytes/10485760',  # 10MB
            'large': 'https://httpbin.org/bytes/52428800',   # 50MB
        }
    
    def ping_test(self, host='8.8.8.8'):
        """Prueba de ping usando requests"""
        try:
            start_time = time.time()
            response = requests.get(f'https://httpbin.org/delay/0', timeout=5)
            end_time = time.time()
            
            if response.status_code == 200:
                return (end_time - start_time) * 1000  # Convertir a ms
            return None
        except:
            return None
    
    def download_test(self):
        """Prueba de velocidad de descarga"""
        try:
            print("⬇️ Iniciando prueba de descarga...")
            
            # Usar archivo mediano para la prueba
            url = self.test_files['medium']
            
            start_time = time.time()
            response = requests.get(url, stream=True, timeout=30)
            
            total_bytes = 0
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    total_bytes += len(chunk)
            
            end_time = time.time()
            duration = end_time - start_time
            
            # Calcular velocidad en Mbps
            speed_mbps = (total_bytes * 8) / (duration * 1_000_000)
            
            print(f"📊 Descarga completada: {speed_mbps:.2f} Mbps")
            return speed_mbps
            
        except Exception as e:
            print(f"❌ Error en prueba de descarga: {e}")
            return 0.0
    
    def upload_test(self):
        """Prueba de velocidad de subida (simulada)"""
        try:
            print("⬆️ Iniciando prueba de subida...")
            
            # Datos de prueba (1MB)
            data = b'0' * 1048576
            
            start_time = time.time()
            response = requests.post('https://httpbin.org/post', 
                                   data=data, 
                                   timeout=30,
                                   headers={'Content-Type': 'application/octet-stream'})
            end_time = time.time()
            
            duration = end_time - start_time
            
            # Calcular velocidad en Mbps
            speed_mbps = (len(data) * 8) / (duration * 1_000_000)
            
            print(f"📊 Subida completada: {speed_mbps:.2f} Mbps")
            return speed_mbps
            
        except Exception as e:
            print(f"❌ Error en prueba de subida: {e}")
            return 0.0
    
    def run_speed_test(self, app=None):
        """Ejecuta una prueba de velocidad personalizada completa"""
        try:
            print("🚀 Iniciando prueba de velocidad personalizada...")
            self.test_running = True
            
            # Crear contexto de aplicación si se proporciona
            if app:
                app_context = app.app_context()
                app_context.push()
            else:
                app_context = None
            
            # Realizar pruebas
            print("🏓 Probando ping...")
            ping = self.ping_test()
            if ping is None:
                ping = 25.0  # Valor por defecto si falla
            
            print("⬇️ Probando velocidad de descarga...")
            download_speed = self.download_test()
            
            print("⬆️ Probando velocidad de subida...")
            upload_speed = self.upload_test()
            
            print(f"📊 Ping: {ping:.2f} ms")
            print(f"📊 Descarga: {download_speed:.2f} Mbps")
            print(f"📊 Subida: {upload_speed:.2f} Mbps")
            
            # Crear registro en la base de datos
            current_time = datetime.now()
            print(f"🕐 Hora local del servidor (custom): {current_time}")
            
            speed_test = SpeedTest(
                download_speed=download_speed,
                upload_speed=upload_speed,
                ping=ping,
                server_name='CustomTest Server',
                server_location='Internet',
                ip_address='Unknown',
                isp='Unknown'
            )
            
            print("💾 Guardando resultados en la base de datos...")
            db.session.add(speed_test)
            db.session.commit()
            
            self.current_test = speed_test.to_dict()
            self.test_running = False
            
            print("✅ Prueba personalizada completada exitosamente!")
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
            print(f"❌ Error en la prueba de velocidad personalizada: {str(e)}")
            print(f"📋 Tipo de error: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            
            # Limpiar contexto de aplicación en caso de error
            if 'app_context' in locals() and app_context:
                app_context.pop()
            
            return {
                'success': False,
                'error': str(e),
                'message': 'Error al realizar la prueba de velocidad personalizada'
            }
    
    def run_speed_test_async(self):
        """Ejecuta la prueba de velocidad en un hilo separado"""
        if self.test_running:
            print("⚠️ Ya hay una prueba de velocidad en curso")
            return {
                'success': False,
                'message': 'Ya hay una prueba de velocidad en curso'
            }
        
        print("🔄 Iniciando hilo de prueba de velocidad personalizada...")
        # Ejecutar en hilo separado para no bloquear la aplicación
        app = current_app._get_current_object()  # Obtener la aplicación actual
        thread = threading.Thread(target=self.run_speed_test, args=(app,))
        thread.daemon = True  # Hacer el hilo daemon
        thread.start()
        
        print("✅ Hilo de prueba personalizada iniciado correctamente")
        return {
            'success': True,
            'message': 'Prueba de velocidad personalizada iniciada'
        }
    
    def get_test_status(self):
        """Obtiene el estado actual de la prueba"""
        return {
            'running': self.test_running,
            'current_test': self.current_test
        }

# Instancia del servicio personalizado
custom_speedtest_service = CustomSpeedTestService()