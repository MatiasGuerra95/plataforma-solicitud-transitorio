from .solicitud_routes import bp as solicitud_bp
from .health import bp as health_bp

def register_routes(app):
    app.register_blueprint(health_bp)
    app.register_blueprint(solicitud_bp)
