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
    # Parámetros
    page      = request.args.get("page",     type=int, default=1)
    per_page  = request.args.get("per_page", type=int, default=5)
    empresa   = request.args.get("empresa",  type=str)
    fecha_desde = request.args.get("fecha_desde", type=str)
    fecha_hasta = request.args.get("fecha_hasta", type=str)

    q = Solicitud.query
    if empresa:
        q = q.filter(Solicitud.empresa.ilike(f"%{empresa}%"))
    if fecha_desde:
        q = q.filter(Solicitud.fecha_creacion >= fecha_desde)
    if fecha_hasta:
        q = q.filter(Solicitud.fecha_creacion <= fecha_hasta)

    pag = q.order_by(Solicitud.fecha_creacion.desc()) \
           .paginate(page=page, per_page=per_page, error_out=False)

    items = [s.to_dict() for s in pag.items]
    meta  = {
      "page":     pag.page,
      "pages":    pag.pages,
      "has_prev": pag.has_prev,
      "has_next": pag.has_next,
      "total":    pag.total
    }
    return jsonify(data=items, meta=meta), 200

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
