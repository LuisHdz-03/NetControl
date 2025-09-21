from app import db
from sqlalchemy import UniqueConstraint

class Inventario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    noSerie = db.Column(db.String(100), nullable=False)
    cantidadTotal = db.Column(db.Integer, nullable=False, default=0)
    unidades_activas = db.relationship("UnidadActiva", back_populates="inventario", lazy=True)

    __table_args__ = (
        UniqueConstraint("modelo", "noSerie", name="uq_modelo_noserie"),
    )

    def cantidad_activa(self):
        return len(self.unidades_activas)

    def cantidad_inactiva(self):
        return self.cantidadTotal - self.cantidad_activa()

    def serialize(self):
       return {
        "id": self.id,
        "nombre": self.nombre,
        "modelo": self.modelo,
        "noSerie": self.noSerie,
        "cantidadTotal": self.cantidadTotal,
        "cantidadActiva": self.cantidad_activa(),
        "cantidadInactiva": self.cantidad_inactiva(),
        "unidadesActivas": [u.serialize() for u in self.unidades_activas]
    }


class UnidadActiva(db.Model):
    __tablename__ = 'unidades_activas'
    id = db.Column(db.Integer, primary_key=True)
    inventario_id = db.Column(db.Integer, db.ForeignKey('inventario.id'), nullable=False)
    ubicacion = db.Column(db.String(100), nullable=False)

    inventario = db.relationship("Inventario", back_populates="unidades_activas")

    def serialize(self):
        return {
            "id": self.id,
            "ubicacion": self.ubicacion
        }

    def serialize_with_details(self):
        return {
            "id": self.id, 
            "ubicacion": self.ubicacion,
            "nombre": self.inventario.nombre,
            "modelo": self.inventario.modelo,
            "noSerie": self.inventario.noSerie
        }
