from app import db

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    modelo = db.Column(db.String(100), nullable=False)
    noSerie = db.Column(db.String(100), unique=True, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    ubicacion = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.String(20), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "modelo": self.modelo,
            "noSerie": self.noSerie,
            "total": self.total,
            "ubicacion": self.ubicacion,
            "estado": self.estado,
        }
