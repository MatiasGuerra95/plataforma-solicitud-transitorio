# backend/models/solicitud.py
from datetime import datetime
from extensions import db

class Solicitud(db.Model):
    __tablename__ = 'solicitudes'

    id = db.Column(db.Integer, primary_key=True)
    empresa = db.Column(db.String(120), nullable=False)
    cargo = db.Column(db.String(120), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "empresa": self.empresa,
            "cargo": self.cargo,
            "fecha_creacion": self.fecha_creacion.isoformat()
        }
