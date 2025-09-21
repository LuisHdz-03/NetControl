from flask import Blueprint, request, jsonify
from app.services.inventory_service import (
    create_inventario, list_inventario, delete_inventario,
    activar_unidad, desactivar_unidad, list_unidades_activas,
    update_unidad_activa, update_inventario
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