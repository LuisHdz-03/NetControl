from app import db
from datetime import datetime

# Tabla de Fallas
class Fallas(db.Model):
    __tablename__ = "fallas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    descripcion = db.Column(db.String(200), nullable=False)
    fecha_alta = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    estado = db.Column(db.String(20), default="pendiente")  

    tecnico_id = db.Column(db.Integer, db.ForeignKey("tecnicos.id"))
    
    def serialize(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion,
            "fecha_alta": self.fecha_alta.strftime("%Y-%m-%d %H:%M:%S"),
            "estado": self.estado,
            "tecnico_id": self.tecnico_id
        }