'''backend/manage.py'''
from flask.cli import FlaskGroup
from flask_migrate import Migrate
from app import app, db

# Inicializar migraciones
migrate = Migrate(app, db)
cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
