from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configuración SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///inventario.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


# Modelo de la base de datos
class Item(db.Model):
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


# Crear tablas si no existen
with app.app_context():
    db.create_all()

#Agregar un nuevo item
@app.route('/items', methods=['POST'])
def add_item():
    data = request.json
    nuevo_item = Item(
        nombre=data.get("nombre"),
        modelo=data.get("modelo"),
        noSerie=data.get("noSerie"),
        total=data.get("total"),
        ubicacion=data.get("ubicacion"),
        estado=data.get("estado"),
    )
    db.session.add(nuevo_item)
    db.session.commit()
    return jsonify({"message": "Item agregado con éxito"}), 201


#Listar todos los items
@app.route('/items', methods=['GET'])
def get_invetory():
    items = Item.query.all()
    return jsonify([i.serialize() for i in items])

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item no encontrado"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item eliminado"})



if __name__ == '__main__':
    app.run(debug=True) # Run port 5000
