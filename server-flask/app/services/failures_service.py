from app import db
from app.models.failures_model import Fallas

# Crear Falla
def create_falla(data):
    try:
        nueva_falla = Fallas(
            descripcion=data.get("descripcion"),
            cliente=data.get("cliente", "Desconocido"),  # Evita null
            unidad_id=data.get("unidad_id"),            # Dispositivo activo
            estado=data.get("estado", "pendiente"),
            tecnico_id=data.get("tecnico_id"),
            prioridad=data.get("prioridad", "media"),
            notas=data.get("notas")
        )
        db.session.add(nueva_falla)
        db.session.commit()
        return nueva_falla.serialize(), 201
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500


# Obtener todas las Fallas
def get_fallas():
    try:
        fallas = Fallas.query.all()
        return [falla.serialize() for falla in fallas], 200
    except Exception as e:
        return {"error": str(e)}, 500


# Obtener una Falla por ID
def get_falla(falla_id):
    try:
        falla = Fallas.query.get(falla_id)
        if not falla:
            return {"error": "Falla no encontrada"}, 404
        return falla.serialize(), 200
    except Exception as e:
        return {"error": str(e)}, 500


# Actualizar una Falla
def update_falla(falla_id, data):
    try:
        falla = Fallas.query.get(falla_id)
        if not falla:
            return {"error": "Falla no encontrada"}, 404

        falla.descripcion = data.get("descripcion", falla.descripcion)
        falla.cliente = data.get("cliente", falla.cliente)
        falla.unidad_id = data.get("unidad_id", falla.unidad_id)
        falla.estado = data.get("estado", falla.estado)
        falla.tecnico_id = data.get("tecnico_id", falla.tecnico_id)
        falla.prioridad = data.get("prioridad", falla.prioridad)
        falla.notas = data.get("notas", falla.notas)
        if "fecha_resolucion" in data:
            falla.fecha_resolucion = data.get("fecha_resolucion")

        db.session.commit()
        return falla.serialize(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500


# Eliminar una Falla
def delete_falla(falla_id):
    try:
        falla = Fallas.query.get(falla_id)
        if not falla:
            return {"error": "Falla no encontrada"}, 404

        db.session.delete(falla)
        db.session.commit()
        return {"message": f"Falla '{falla.descripcion}' eliminada", "id": falla.id}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
