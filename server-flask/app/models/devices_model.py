from app import db
from datetime import datetime


class NetworkDevice(db.Model):
    __tablename__ = "network_devices"

    id = db.Column(db.Integer, primary_key=True)
    ip_address = db.Column(db.String(15), nullable=False, unique=True)
    mac_address = db.Column(db.String(17), nullable=True)
    hostname = db.Column(db.String(255), nullable=True)
    device_type = db.Column(
        db.String(100), nullable=True
    )  # router, computer, phone, etc.
    manufacturer = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default="active")  # active, inactive, unknown
    open_ports = db.Column(db.Text, nullable=True)  # JSON string of open ports
    os_info = db.Column(db.String(255), nullable=True)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    first_discovered = db.Column(db.DateTime, default=datetime.utcnow)
    is_managed = db.Column(
        db.Boolean, default=False
    )  # Si es un dispositivo gestionado por NetControl
    notes = db.Column(db.Text, nullable=True)

    def __init__(
        self,
        ip_address,
        mac_address=None,
        hostname=None,
        device_type=None,
        manufacturer=None,
        status="active",
        open_ports=None,
        os_info=None,
        is_managed=False,
        notes=None,
    ):
        self.ip_address = ip_address
        self.mac_address = mac_address
        self.hostname = hostname
        self.device_type = device_type
        self.manufacturer = manufacturer
        self.status = status
        self.open_ports = open_ports
        self.os_info = os_info
        self.is_managed = is_managed
        self.notes = notes

    def serialize(self):
        return {
            "id": self.id,
            "ip_address": self.ip_address,
            "mac_address": self.mac_address,
            "hostname": self.hostname,
            "device_type": self.device_type,
            "manufacturer": self.manufacturer,
            "status": self.status,
            "open_ports": self.open_ports,
            "os_info": self.os_info,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
            "first_discovered": (
                self.first_discovered.isoformat() if self.first_discovered else None
            ),
            "is_managed": self.is_managed,
            "notes": self.notes,
        }

    def update_last_seen(self):
        self.last_seen = datetime.utcnow()

    def update_status(self, status):
        self.status = status
        self.update_last_seen()

    def __repr__(self):
        return f"<NetworkDevice {self.ip_address} - {self.hostname}>"
