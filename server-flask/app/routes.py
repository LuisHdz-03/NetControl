from flask import Blueprint, request, jsonify
from app.services.inventory_service import (
    create_inventario,
    list_inventario,
    delete_inventario,
    activar_unidad,
    desactivar_unidad,
    list_unidades_activas,
    update_unidad_activa,
    update_inventario,
)
from app.services.technicians_service import (
    create_tecnico,
    get_all_tecnicos,
    get_tecnico_by_id,
    update_tecnico,
    delete_tecnico,
)
from app.services.network_devices_service import (
    scan_network_devices,
    get_all_network_devices,
    get_device_by_id,
    update_device,
    delete_device,
    network_scanner,
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


@main.route("/inventory/<int:item_id>", methods=["PUT"])
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


@main.route("/unidades_activas", methods=["GET"])
def get_unidades_activas_route():
    unidades_list = list_unidades_activas()
    return jsonify(unidades_list)


@main.route("/unidades_activas/<int:unidad_id>", methods=["PUT"])
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

# ----- Rutas de Dispositivos de Red -----


@main.route("/devices/scan", methods=["POST"])
def scan_network():
    """Escanea la red local en busca de dispositivos"""
    data = request.get_json() or {}
    network_range = data.get("network_range", None)

    result = scan_network_devices(network_range)

    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify(result), 500


@main.route("/devices", methods=["GET"])
def get_network_devices():
    """Obtiene todos los dispositivos de red"""
    devices = get_all_network_devices()
    return jsonify(devices), 200


@main.route("/devices/<int:device_id>", methods=["GET"])
def get_network_device(device_id):
    """Obtiene un dispositivo específico"""
    device = get_device_by_id(device_id)
    if not device:
        return jsonify({"error": "Dispositivo no encontrado"}), 404
    return jsonify(device), 200


@main.route("/devices/<int:device_id>", methods=["PUT"])
def update_network_device(device_id):
    """Actualiza información de un dispositivo"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No se enviaron datos"}), 400

    result = update_device(device_id, data)
    if "error" in result:
        return jsonify(result), 404 if "no encontrado" in result["error"] else 500

    return jsonify(result), 200


@main.route("/devices/<int:device_id>", methods=["DELETE"])
def delete_network_device(device_id):
    """Elimina un dispositivo"""
    result = delete_device(device_id)
    if "error" in result:
        return jsonify(result), 404 if "no encontrado" in result["error"] else 500

    return jsonify(result), 200


@main.route("/devices/reset", methods=["POST"])
def reset_devices_database():
    """Resetea manualmente la base de datos de dispositivos"""
    result = network_scanner.reset_devices_database("manual")

    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify(result), 500


@main.route("/devices/cleanup", methods=["POST"])
def cleanup_inactive_devices():
    """Limpia dispositivos inactivos antiguos"""
    data = request.get_json() or {}
    max_age_hours = data.get("max_age_hours", 24)

    result = network_scanner.cleanup_inactive_devices(max_age_hours)

    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify(result), 500


@main.route("/devices/status", methods=["GET"])
def get_devices_status():
    """Obtiene el estado del sistema de dispositivos"""
    from datetime import datetime

    total_devices = len(get_all_network_devices())
    time_since_reset = (
        datetime.utcnow() - network_scanner.last_reset_time
    ).total_seconds() / 60

    return (
        jsonify(
            {
                "current_network": network_scanner.current_network,
                "total_devices": total_devices,
                "last_reset_time": network_scanner.last_reset_time.isoformat(),
                "minutes_since_reset": round(time_since_reset, 1),
                "auto_reset_interval_minutes": network_scanner.auto_reset_interval / 60,
                "next_auto_reset_in_minutes": max(
                    0, (network_scanner.auto_reset_interval / 60) - time_since_reset
                ),
            }
        ),
        200,
    )
