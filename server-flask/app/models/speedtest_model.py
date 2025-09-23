from app import db
from datetime import datetime

class SpeedTest(db.Model):
    __tablename__ = 'speedtest'
    
    id = db.Column(db.Integer, primary_key=True)
    download_speed = db.Column(db.Float, nullable=False)  # Mbps
    upload_speed = db.Column(db.Float, nullable=False)    # Mbps
    ping = db.Column(db.Float, nullable=False)            # ms
    server_name = db.Column(db.String(255))
    server_location = db.Column(db.String(255))
    ip_address = db.Column(db.String(45))
    isp = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.now)  # Hora local en lugar de UTC
    
    def to_dict(self):
        return {
            'id': self.id,
            'download_speed': round(self.download_speed, 2),
            'upload_speed': round(self.upload_speed, 2),
            'ping': round(self.ping, 2),
            'server_name': self.server_name,
            'server_location': self.server_location,
            'ip_address': self.ip_address,
            'isp': self.isp,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }