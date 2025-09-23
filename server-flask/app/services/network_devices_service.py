import subprocess
import json
import socket
import ipaddress
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from app import db
from app.models.devices_model import NetworkDevice


class NetworkScanner:
    def __init__(self):
        self.discovered_devices = []
        self.current_network = None
        self.last_reset_time = datetime.utcnow()
        self.auto_reset_interval = 15 * 60  # 15 minutos en segundos

    def get_local_network_range(self):
        """Obtiene el rango de red local"""
        try:
            # Obtener la IP local
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()

            # Crear el rango de red (asumiendo /24)
            network = ipaddress.IPv4Network(f"{local_ip}/24", strict=False)
            return str(network)
        except Exception as e:
            print(f"Error obteniendo rango de red: {e}")
            return "192.168.1.0/24"  # fallback

    def has_network_changed(self):
        """Detecta si ha cambiado la red"""
        try:
            current_network = self.get_local_network_range()
            if self.current_network is None:
                self.current_network = current_network
                return False

            if self.current_network != current_network:
                print(
                    f" Cambio de red detectado: {self.current_network} -> {current_network}"
                )
                self.current_network = current_network
                return True

            return False
        except Exception as e:
            print(f"Error detectando cambio de red: {e}")
            return False

    def should_auto_reset(self):
        """Verifica si debe hacer reset automático por tiempo"""
        now = datetime.utcnow()
        time_diff = (now - self.last_reset_time).total_seconds()

        if time_diff >= self.auto_reset_interval:
            print(
                f" Reset automático por tiempo transcurrido: {time_diff/60:.1f} minutos"
            )
            return True

        return False

    def reset_devices_database(self, reason="manual"):
        """Limpia la base de datos de dispositivos"""
        try:
            deleted_count = NetworkDevice.query.delete()
            db.session.commit()
            self.last_reset_time = datetime.utcnow()

            print(
                f" Base de datos reseteada ({reason}): {deleted_count} dispositivos eliminados"
            )
            return {
                "success": True,
                "devices_deleted": deleted_count,
                "reason": reason,
                "reset_time": self.last_reset_time.isoformat(),
            }
        except Exception as e:
            db.session.rollback()
            print(f" Error reseteando base de datos: {e}")
            return {"success": False, "error": str(e)}

    def cleanup_inactive_devices(self, max_age_hours=24):
        """Elimina dispositivos inactivos más antiguos que max_age_hours"""
        try:
            from datetime import timedelta

            cutoff_time = datetime.utcnow() - timedelta(hours=max_age_hours)

            deleted_count = NetworkDevice.query.filter(
                NetworkDevice.status == "inactive",
                NetworkDevice.last_seen < cutoff_time,
            ).delete(synchronize_session=False)

            db.session.commit()

            print(
                f" Limpieza automática: {deleted_count} dispositivos inactivos eliminados"
            )
            return {
                "success": True,
                "devices_deleted": deleted_count,
                "cutoff_hours": max_age_hours,
            }
        except Exception as e:
            db.session.rollback()
            print(f" Error en limpieza automática: {e}")
            return {"success": False, "error": str(e)}

    def ping_host(self, ip):
        """Hace ping a una IP específica"""
        try:
            # Usar ping de Windows
            result = subprocess.run(
                ["ping", "-n", "1", "-w", "1000", str(ip)],
                capture_output=True,
                text=True,
                timeout=5,
            )
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            return False
        except Exception:
            return False

    def get_hostname(self, ip):
        """Obtiene el hostname de una IP"""
        try:
            hostname = socket.gethostbyaddr(str(ip))[0]
            return hostname
        except:
            return None

    def get_mac_address(self, ip):
        """Obtiene la dirección MAC usando ARP (Windows)"""
        try:
            result = subprocess.run(
                ["arp", "-a", str(ip)], capture_output=True, text=True, timeout=5
            )
            if result.returncode == 0:
                lines = result.stdout.strip().split("\n")
                for line in lines:
                    if str(ip) in line:
                        parts = line.split()
                        if len(parts) >= 2:
                            mac = parts[1]
                            if len(mac) == 17 and mac.count("-") == 5:
                                return mac.replace("-", ":")
            return None
        except:
            return None

    def scan_port(self, ip, port, timeout=1):
        """Escanea un puerto específico"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            result = sock.connect_ex((str(ip), port))
            sock.close()
            return result == 0
        except:
            return False

    def scan_common_ports(self, ip):
        """Escanea puertos comunes y específicos por tipo de dispositivo"""
        common_ports = [
            21,  # FTP
            22,  # SSH
            23,  # Telnet
            25,  # SMTP
            53,  # DNS
            80,  # HTTP
            110,  # POP3
            135,  # RPC (Windows)
            139,  # NetBIOS (Windows)
            143,  # IMAP
            443,  # HTTPS
            445,  # SMB (Windows)
            631,  # IPP (Impresoras)
            993,  # IMAPS
            995,  # POP3S
            1723,  # PPTP
            3389,  # RDP (Windows)
            5353,  # mDNS (Bonjour)
            5900,  # VNC
            8080,  # HTTP alternativo
            8443,  # HTTPS alternativo
            9100,  # Impresoras HP
        ]
        open_ports = []

        with ThreadPoolExecutor(max_workers=10) as executor:
            port_futures = {
                executor.submit(self.scan_port, ip, port): port for port in common_ports
            }

            for future in port_futures:
                port = port_futures[future]
                try:
                    if future.result():
                        open_ports.append(port)
                except:
                    pass

        return open_ports

    def identify_device_type(self, ip, open_ports, hostname):
        """Intenta identificar el tipo de dispositivo con algoritmo mejorado"""
        device_type = "unknown"
        hostname_lower = (hostname or "").lower()

        # Análisis por hostname primero (más confiable)
        hostname_patterns = {
            "router": [
                "router",
                "gateway",
                "gw",
                "rt-",
                "linksys",
                "netgear",
                "asus",
                "tp-link",
            ],
            "switch": ["switch", "sw-", "cisco", "hp-switch"],
            "printer": [
                "printer",
                "print",
                "canon",
                "hp-",
                "epson",
                "brother",
                "xerox",
            ],
            "access_point": ["ap-", "access-point", "wifi", "wireless"],
            "server": ["server", "srv-", "dc-", "mail", "web", "db-", "sql"],
            "computer": ["desktop", "pc-", "workstation", "ws-"],
            "mobile": ["android", "iphone", "phone", "mobile", "tablet", "ipad"],
            "camera": ["camera", "cam-", "cctv", "security"],
            "iot": ["iot-", "sensor", "thermostat", "smart", "alexa", "google"],
        }

        for dev_type, patterns in hostname_patterns.items():
            if any(pattern in hostname_lower for pattern in patterns):
                device_type = dev_type
                break

        # Si no se identificó por hostname, usar puertos
        if device_type == "unknown" and open_ports:
            # Análisis por combinaciones de puertos
            ports_set = set(open_ports)

            # Routers/Gateways (típicamente tienen web interface + otros servicios)
            if {80, 443}.intersection(ports_set) and (
                22 in ports_set or 23 in ports_set
            ):
                device_type = "router"

            # Servidores Windows (RDP + otros servicios)
            elif 3389 in ports_set:
                if ports_set.intersection({80, 443, 445, 135}):
                    device_type = "windows_server"
                else:
                    device_type = "windows_computer"

            # Servidores Linux/Unix (SSH + servicios web)
            elif 22 in ports_set:
                if ports_set.intersection({80, 443, 25, 53, 21}):
                    device_type = "linux_server"
                else:
                    device_type = "linux_computer"

            # Impresoras de red (puerto 9100 es común en impresoras)
            elif 9100 in ports_set or 631 in ports_set:
                device_type = "printer"

            # Cámaras IP (típicamente solo web interface)
            elif ports_set == {80} or ports_set == {443} or ports_set == {80, 443}:
                device_type = "camera_or_iot"

            # Servidores web dedicados
            elif ports_set.intersection({80, 443, 8080, 8443}):
                device_type = "web_server"

            # VNC
            elif 5900 in ports_set:
                device_type = "computer"

            # Email servers
            elif ports_set.intersection({25, 110, 143, 993, 995}):
                device_type = "mail_server"

        # Análisis por rango de IP (algunas convenciones comunes)
        if device_type == "unknown":
            ip_parts = str(ip).split(".")
            if len(ip_parts) == 4:
                last_octet = int(ip_parts[3])
                # Convenciones comunes
                if last_octet == 1:
                    device_type = "router"  # Típicamente .1 es el gateway
                elif last_octet == 254:
                    device_type = "router"  # Algunos routers usan .254
                elif 2 <= last_octet <= 10:
                    device_type = "network_device"  # Rango típico para switches/APs
                elif 100 <= last_octet <= 199:
                    device_type = "computer"  # Rango común para PCs

        # Si no hay puertos abiertos, probablemente es un dispositivo móvil o IoT
        if not open_ports:
            device_type = "mobile_or_iot"

        return device_type

    def scan_single_host(self, ip):
        """Escanea un host individual"""
        if not self.ping_host(ip):
            return None

        hostname = self.get_hostname(ip)
        mac_address = self.get_mac_address(ip)
        open_ports = self.scan_common_ports(ip)
        device_type = self.identify_device_type(ip, open_ports, hostname)

        device_info = {
            "ip_address": str(ip),
            "hostname": hostname,
            "mac_address": mac_address,
            "device_type": device_type,
            "open_ports": json.dumps(open_ports) if open_ports else None,
            "status": "active",
            "last_seen": datetime.utcnow(),
        }

        return device_info

    def scan_network(self, network_range=None):
        """Escanea toda la red"""
        if not network_range:
            network_range = self.get_local_network_range()

        try:
            network = ipaddress.IPv4Network(network_range, strict=False)
        except ValueError:
            raise ValueError(f"Rango de red inválido: {network_range}")

        discovered = []

        # Usar ThreadPoolExecutor para escaneo paralelo
        with ThreadPoolExecutor(max_workers=50) as executor:
            # Enviar trabajos para cada IP en la red
            future_to_ip = {
                executor.submit(self.scan_single_host, ip): ip for ip in network.hosts()
            }

            for future in future_to_ip:
                try:
                    result = future.result(timeout=10)
                    if result:
                        discovered.append(result)
                except Exception as e:
                    print(f"Error escaneando {future_to_ip[future]}: {e}")

        return discovered


# Instancia global del scanner
network_scanner = NetworkScanner()


def scan_network_devices(network_range=None):
    """Función principal para escanear y guardar dispositivos con gestión inteligente"""
    try:
        # Verificar si debe hacer reset por cambio de red
        network_changed = network_scanner.has_network_changed()

        # Verificar si debe hacer reset por tiempo transcurrido
        should_reset_by_time = network_scanner.should_auto_reset()

        # Realizar reset si es necesario
        reset_info = None
        if network_changed:
            reset_info = network_scanner.reset_devices_database("cambio_de_red")
        elif should_reset_by_time:
            # En lugar de reset completo, limpiar solo los muy antiguos
            reset_info = network_scanner.cleanup_inactive_devices(1)  # 1 hora

        # Escanear la red
        devices_data = network_scanner.scan_network(network_range)

        saved_devices = []

        for device_data in devices_data:
            # Buscar si el dispositivo ya existe
            existing_device = NetworkDevice.query.filter_by(
                ip_address=device_data["ip_address"]
            ).first()

            if existing_device:
                # Actualizar dispositivo existente
                existing_device.hostname = device_data["hostname"]
                existing_device.mac_address = device_data["mac_address"]
                existing_device.device_type = device_data["device_type"]
                existing_device.open_ports = device_data["open_ports"]
                existing_device.update_last_seen()
                existing_device.status = "active"
                saved_devices.append(existing_device)
            else:
                # Crear nuevo dispositivo
                new_device = NetworkDevice(
                    ip_address=device_data["ip_address"],
                    hostname=device_data["hostname"],
                    mac_address=device_data["mac_address"],
                    device_type=device_data["device_type"],
                    open_ports=device_data["open_ports"],
                    status="active",
                )
                db.session.add(new_device)
                saved_devices.append(new_device)

        # Marcar dispositivos no encontrados como inactivos (solo en la red actual)
        all_scanned_ips = [d["ip_address"] for d in devices_data]

        # Obtener el rango de red actual para filtrar solo dispositivos de esta red
        current_network = network_scanner.get_local_network_range()
        network_prefix = ".".join(current_network.split(".")[:3])  # Ej: "192.168.1"

        # Marcar como inactivos solo los dispositivos de la red actual que no se encontraron
        inactive_devices = NetworkDevice.query.filter(
            ~NetworkDevice.ip_address.in_(all_scanned_ips),
            NetworkDevice.status == "active",
            NetworkDevice.ip_address.like(f"{network_prefix}.%"),
        ).all()

        print(
            f"🔍 Marcando {len(inactive_devices)} dispositivos como inactivos en red {network_prefix}.x"
        )

        for device in inactive_devices:
            device.status = "inactive"
            device.update_last_seen()  # Actualizar timestamp

        db.session.commit()

        result = {
            "success": True,
            "devices_found": len(saved_devices),
            "devices_updated": len([d for d in saved_devices if d.id is not None]),
            "devices_added": len([d for d in saved_devices if d.id is None]),
            "devices_inactive": len(inactive_devices),
            "current_network": network_scanner.current_network,
        }

        # Incluir información de reset si ocurrió
        if reset_info:
            result["reset_performed"] = reset_info

        return result

    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}


def get_all_network_devices():
    """Obtiene todos los dispositivos de red almacenados"""
    try:
        devices = NetworkDevice.query.order_by(NetworkDevice.last_seen.desc()).all()
        return [device.serialize() for device in devices]
    except Exception as e:
        return {"error": str(e)}


def get_device_by_id(device_id):
    """Obtiene un dispositivo específico por ID"""
    try:
        device = NetworkDevice.query.get(device_id)
        return device.serialize() if device else None
    except Exception as e:
        return {"error": str(e)}


def update_device(device_id, data):
    """Actualiza información de un dispositivo"""
    try:
        device = NetworkDevice.query.get(device_id)
        if not device:
            return {"error": "Dispositivo no encontrado"}

        # Actualizar campos permitidos
        updatable_fields = ["hostname", "device_type", "is_managed", "notes"]
        for field in updatable_fields:
            if field in data:
                setattr(device, field, data[field])

        device.update_last_seen()
        db.session.commit()

        return device.serialize()
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}


def delete_device(device_id):
    """Elimina un dispositivo de la base de datos"""
    try:
        device = NetworkDevice.query.get(device_id)
        if not device:
            return {"error": "Dispositivo no encontrado"}

        db.session.delete(device)
        db.session.commit()

        return {"success": True, "message": "Dispositivo eliminado correctamente"}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}
