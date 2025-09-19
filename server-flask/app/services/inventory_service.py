from app.models.inventory_model import Inventario, UnidadActiva
from app import db

# --------------------------
# Inventario
# --------------------------
def create_inventario(data):
    nuevo_item = Inventario(
        nombre=data.get("nombre"),
        modelo=data.get("modelo"),
        noSerie=data.get("noSerie"),
        cantidadTotal=data.get("cantidadTotal", 0)
    )
    db.session.add(nuevo_item)
    db.session.commit()
    return nuevo_item.serialize()

def list_inventario():
    return [i.serialize() for i in Inventario.query.all()]

def delete_inventario(item_id):
    item = Inventario.query.get(item_id)
    if not item:
        return {"error": "Inventario no encontrado"}, 404
    db.session.delete(item)
    db.session.commit()
    return {"message": "Inventario eliminado"}

def update_inventario(item_id, data):
    item = Inventario.query.get(item_id)
    if not item:
        return {"error": "Inventario no encontrado"}, 404

    item.nombre = data.get("nombre", item.nombre)
    item.modelo = data.get("modelo", item.modelo)
    item.noSerie = data.get("noSerie", item.noSerie)
    item.cantidadTotal = data.get("cantidadTotal", item.cantidadTotal)
    
    db.session.commit()
    return item.serialize()


# --------------------------
# Unidades activas
# --------------------------
def activar_unidad(inventario_id, ubicacion):
    inventario_item = Inventario.query.get(inventario_id)
    if not inventario_item:
        return {"error": "Inventario no encontrado"}, 404

    if inventario_item.cantidad_activa() >= inventario_item.cantidadTotal:
        return {"error": "No hay unidades disponibles para activar"}, 400

    nueva_unidad = UnidadActiva(
        inventario_id=inventario_id,
        ubicacion=ubicacion
    )
    db.session.add(nueva_unidad)
    db.session.commit()
    return {
        "message": "Unidad activada",
        "unidad": {
            "id": nueva_unidad.id,
            "inventario_id": nueva_unidad.inventario_id,
            "ubicacion": nueva_unidad.ubicacion
        }
    }

def desactivar_unidad(unidad_id):
    unidad = UnidadActiva.query.get(unidad_id)
    if not unidad:
        return {"error": "Unidad no encontrada"}, 404
    try:
        db.session.delete(unidad)
        db.session.commit()
        return {"message": "Unidad desactivada"}, 200
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500

def list_unidades_activas():
    unidades = UnidadActiva.query.all()
    return [unidad.serialize_with_details() for unidad in unidades]

def update_unidad_activa(unidad_id, data):
    unidad = UnidadActiva.query.get(unidad_id)
    if not unidad:
        return {"error": "Unidad activa no encontrada"}, 404

    unidad.ubicacion = data.get("ubicacion", unidad.ubicacion)
    
    db.session.commit()
    return unidad.serialize_with_details()