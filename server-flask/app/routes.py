from flask import Blueprint, request, jsonify
from app.services.inventory_service import (
    create_inventario, list_inventario, delete_inventario,
    activar_unidad, desactivar_unidad, list_unidades_activas,
    update_unidad_activa, update_inventario
)
from app.services.technicians_service import (
    create_tecnico, get_all_tecnicos, get_tecnico_by_id,
    update_tecnico, delete_tecnico
)

from app.services.failures_service import (
    create_falla,
    get_fallas,
    get_falla,
    update_falla,
    delete_falla
)


main = Blueprint("main", __name__)


# ----- Rutas De Inventario -----

@main.route("/inventory", methods=["POST"])
def add_item():
    data = request.get_json()
    return create_inventario(data)

@main.route("/inventory", methods=["GET"])
def get_items():
    return jsonify(list_inventario())

@main.route("/inventory/<int:item_id>", methods=["DELETE"])
def remove_item(item_id):
    result, code = delete_inventario(item_id)
    return jsonify(result), code

@main.route('/inventory/<int:item_id>', methods=['PUT'])
def update_inventario_route(item_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se enviaron datos"}), 400
    result = update_inventario(item_id, data)
    return jsonify(result)

@main.route("/unidades_activas", methods=["POST"])
def activate_unit():
    data = request.json
    return activar_unidad(data.get("inventario_id"), data.get("ubicacion"))

@main.route("/unidades_activas/<int:unidad_id>", methods=["DELETE"])
def deactivate_unit(unidad_id):
    result, code = desactivar_unidad(unidad_id)
    return jsonify(result), code

@main.route('/unidades_activas', methods=['GET'])
def get_unidades_activas_route():
    unidades_list = list_unidades_activas()
    return jsonify(unidades_list)

@main.route('/unidades_activas/<int:unidad_id>', methods=['PUT'])
def update_unidad_activa_route(unidad_id):
     data = request.get_json()
     if not data:
         return jsonify({"error": "No se enviaron datos"}), 400
     result = update_unidad_activa(unidad_id, data)
     return jsonify(result)
 
 # ---------------------------
 
 # ----- Rutas de tecnicos
@main.route("/technicians", methods=["POST"])
def add_tecnico():
    data = request.get_json()
    tecnico = create_tecnico(data)
    return jsonify(tecnico.serialize()), 201

@main.route("/technicians", methods=["GET"])
def list_tecnicos():
    tecnicos = get_all_tecnicos()
    return jsonify([t.serialize() for t in tecnicos]), 200

@main.route("/technicians/<int:tecnico_id>", methods=["GET"])
def get_tecnico(tecnico_id):
    tecnico = get_tecnico_by_id(tecnico_id)
    if not tecnico:
        return jsonify({"error": "Técnico no encontrado"}), 404
    return jsonify(tecnico.serialize()), 200

@main.route("/technicians/<int:tecnico_id>", methods=["PUT"])
def update_tecnico_route(tecnico_id):
    data = request.get_json()
    tecnico = update_tecnico(tecnico_id, data)
    if not tecnico:
        return jsonify({"error": "Técnico no encontrado"}), 404
    return jsonify(tecnico.serialize()), 200

@main.route("/technicians/<int:tecnico_id>", methods=["DELETE"])
def delete_tecnico_route(tecnico_id):
    tecnico = delete_tecnico(tecnico_id)
    if not tecnico:
        return jsonify({"error": "Técnico no encontrado"}), 404
    return jsonify({"message": "Técnico eliminado correctamente"}), 200

# ---------------------------


# ----- Rutas de fallas
@main.route("/failures", methods=["POST"])
def create():
    data = request.get_json()
    result, status = create_falla(data)
    return jsonify(result), status

@main.route("/failures", methods=["GET"])
def get_all():
    result, status = get_fallas()
    return jsonify(result), status

@main.route("/failures/<int:falla_id>", methods=["GET"])
def get_one(falla_id):
    result, status = get_falla(falla_id)
    return jsonify(result), status

@main.route("/failures/<int:falla_id>", methods=["PUT"])
def update(falla_id):
    data = request.get_json()
    result, status = update_falla(falla_id, data)
    return jsonify(result), status

@main.route("/failures/<int:falla_id>", methods=["DELETE"])
def delete(falla_id):
    result, status = delete_falla(falla_id)
    return jsonify(result), status