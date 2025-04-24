# backend/schemas/solicitud_schema.py
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models.solicitud import Solicitud
from extensions import db

class SolicitudSchema(SQLAlchemyAutoSchema):
    # Declara explícitamente ambos campos como required
    empresa = fields.String(
        required=True,
        error_messages={'required': 'La empresa es obligatoria'}
    )
    cargo = fields.String(
        required=True,
        error_messages={'required': 'El cargo es obligatorio'}
    )

    class Meta:
        model = Solicitud
        load_instance = True
        sqla_session = db.session
