# backend/routes/health.py
from flask import Blueprint, jsonify

bp = Blueprint('health', __name__)

@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify(message='pong')
