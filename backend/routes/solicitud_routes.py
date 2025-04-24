# backend/routes/solicitud_routes.py
from flask import Blueprint, request, jsonify
from extensions import db
from models.solicitud import Solicitud
from schemas.solicitud_schema import SolicitudSchema
from marshmallow import ValidationError

bp = Blueprint("solicitud", __name__, url_prefix="/solicitudes")

# schema para un solo recurso
schema = SolicitudSchema()             
# schema para listas
schema_many = SolicitudSchema(many=True)

@bp.route('/', methods=['POST'])
def crear_solicitud():
    data = request.get_json() or {}
    try:
        s = schema.load(data)
    except ValidationError as err:
        return jsonify(err.messages), 400
    db.session.add(s)
    db.session.commit()
    return jsonify(schema.dump(s)), 201

@bp.route('/', methods=['GET'])
def listar_solicitudes():
    all_s = Solicitud.query.order_by(Solicitud.fecha_creacion.desc()).all()
    return jsonify(schema_many.dump(all_s)), 200

@bp.route('/<int:id>', methods=['PUT'])
def actualizar_solicitud(id):
    s = Solicitud.query.get_or_404(id)
    data = request.get_json() or {}
    try:
        updated = schema.load(data, instance=s, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400
    db.session.commit()
    return jsonify(schema.dump(updated)), 200

@bp.route('/<int:id>', methods=['DELETE'])
def eliminar_solicitud(id):
    s = Solicitud.query.get_or_404(id)
    db.session.delete(s)
    db.session.commit()
    return '', 204
