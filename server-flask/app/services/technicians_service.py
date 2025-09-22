from app import db
from app.models.technicians_model import Tecnicos


# Crear tecnico
def create_tecnico(data):
    nuevo_tecnico = Tecnicos(
        nombre=data.get("nombre"),
        especialidad=data.get("especialidad"),
        telefono=data.get("telefono")
    )
    db.session.add(nuevo_tecnico)
    db.session.commit()
    return nuevo_tecnico


# Obtener todos los tecnicos
def get_all_tecnicos():
    return Tecnicos.query.all()


# Obtener un tecnico por ID
def get_tecnico_by_id(tecnico_id):
    return Tecnicos.query.get(tecnico_id)


# Actualizar tecnico
def update_tecnico(tecnico_id, data):
    tecnico = Tecnicos.query.get(tecnico_id)
    if not tecnico:
        return None

    tecnico.nombre = data.get("nombre", tecnico.nombre)
    tecnico.especialidad = data.get("especialidad", tecnico.especialidad)
    tecnico.telefono = data.get("telefono", tecnico.telefono)

    db.session.commit()
    return tecnico


# Eliminar tecnico
def delete_tecnico(tecnico_id):
    tecnico = Tecnicos.query.get(tecnico_id)
    if not tecnico:
        return None

    db.session.delete(tecnico)
    db.session.commit()
    return tecnico
