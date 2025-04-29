from flask import Blueprint, request, jsonify
from extensions import db
from models.solicitud import Solicitud
from schemas.solicitud_schema import SolicitudSchema
from marshmallow import ValidationError

bp = Blueprint("solicitud", __name__, url_prefix="/solicitudes")

schema       = SolicitudSchema()
schema_many  = SolicitudSchema(many=True)

# ──────────────────────── Crear y Listar ────────────────────────────
@bp.route("/", methods=["POST", "GET"], strict_slashes=False)
@bp.route("",  methods=["POST", "GET"], strict_slashes=False)
def solicitudes_root():
    if request.method == "POST":
        data = request.get_json() or {}
        try:
            s = schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400
        db.session.add(s)
        db.session.commit()
        return jsonify(schema.dump(s)), 201

    # GET listado
    page       = int(request.args.get("page", 1))
    per_page   = int(request.args.get("per_page", 10))
    query      = Solicitud.query.order_by(Solicitud.fecha_creacion.desc())
    paginated  = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "items": schema_many.dump(paginated.items),
        "meta": {
            "page":      paginated.page,
            "pages":     paginated.pages,
            "has_prev":  paginated.has_prev,
            "has_next":  paginated.has_next,
        },
    }), 200

# ──────────────────────── Leer / Actualizar / Borrar ────────────────
@bp.route("/<int:id>",  methods=["PUT", "DELETE", "GET"], strict_slashes=False)
@bp.route("/<int:id>/", methods=["PUT", "DELETE", "GET"], strict_slashes=False)
def solicitud_id(id):
    s = Solicitud.query.get_or_404(id)

    if request.method == "GET":
        return jsonify(schema.dump(s)), 200

    if request.method == "PUT":
        data = request.get_json() or {}
        try:
            updated = schema.load(data, instance=s, partial=True)
        except ValidationError as err:
            return jsonify(err.messages), 400
        db.session.commit()
        return jsonify(schema.dump(updated)), 200

    # DELETE
    db.session.delete(s)
    db.session.commit()
    return "", 204
