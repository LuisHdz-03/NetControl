from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder="../dist")
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    
    # Importamos y registramos las rutas después de inicializar `db`
    from .routes import main
    app.register_blueprint(main)

    # Crear tablas si no existen
    with app.app_context():
        from .models.inventory_model import Inventario, UnidadActiva
        from .models.failures_model import Fallas
        from .models.technicians_model import Tecnicos
        db.create_all()

    return app
