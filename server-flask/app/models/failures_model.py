from app import db
from datetime import datetime

class Fallas(db.Model):
    __tablename__ = "fallas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    descripcion = db.Column(db.String(200), nullable=False)
    cliente = db.Column(db.String(100), nullable=False)
    fecha_alta = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    fecha_resolucion = db.Column(db.DateTime, nullable=True)
    estado = db.Column(db.String(20), default="pendiente", nullable=False)
    prioridad = db.Column(db.String(20), default="media")
    notas = db.Column(db.String(200), nullable=True)

    tecnico_id = db.Column(db.Integer, db.ForeignKey("tecnicos.id"), nullable=True)
    unidad_id = db.Column(db.Integer, db.ForeignKey("unidades_activas.id"), nullable=True)

    # Relaciones
    unidad = db.relationship("UnidadActiva", back_populates="fallas")  # acceso al dispositivo
    tecnico = db.relationship("Tecnicos", back_populates="fallas")     # acceso al técnico

    def serialize(self):
        return {
            "id": self.id,
            "descripcion": self.descripcion,
            "cliente": self.cliente,
            "fecha_alta": self.fecha_alta.strftime("%Y-%m-%d %H:%M:%S"),
            "fecha_resolucion": self.fecha_resolucion.strftime("%Y-%m-%d %H:%M:%S") if self.fecha_resolucion else None,
            "estado": self.estado,
            "prioridad": self.prioridad,
            "notas": self.notas,
            "tecnico_id": self.tecnico_id,
            "unidad_id": self.unidad_id,
            "dispositivo": {
                "nombre": self.unidad.inventario.nombre if self.unidad else None,
                "modelo": self.unidad.inventario.modelo if self.unidad else None,
                "noSerie": self.unidad.inventario.noSerie if self.unidad else None,
                "ubicacion": self.unidad.ubicacion if self.unidad else None,
            } if self.unidad else None
        }
