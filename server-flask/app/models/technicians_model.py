from app import db

class Tecnicos(db.Model):
    __tablename__ = "tecnicos"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    especialidad = db.Column(db.String(100))
    telefono = db.Column(db.String(20))

    # Relación con fallas
    fallas = db.relationship("Fallas", back_populates="tecnico", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "especialidad": self.especialidad,
            "telefono": self.telefono
        }

    def serialize_with_fallas(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "especialidad": self.especialidad,
            "telefono": self.telefono,
            "fallas": [f.serialize() for f in self.fallas] if self.fallas else []
        }
