# backend/app.py
from flask import Flask, jsonify, make_response
from flask_migrate import Migrate, migrate
from flask_cors import CORS
from config import Config
from extensions import db, migrate
from routes import register_routes
import traceback

def create_app():
    app = Flask(__name__)
    # Habilita CORS para todas las rutas
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Carga configuración
    app.config.from_object(Config)

    # Manejador global de excepciones
    @app.errorhandler(Exception)
    def handle_all_exceptions(e):
        traceback.print_exc()
        return make_response(jsonify(error=str(e)), 500)

    # Endpoint de salud
    @app.route('/ping', methods=['GET'])
    def ping():
        return jsonify(message='pong')

    # Inicializar extensiones y rutas
    db.init_app(app)
    migrate.init_app(app, db)
    Migrate(app, db) 
    register_routes(app)

    return app

# Inicializa la app
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
