#Dockerfile del backend
# Usa una imagen ligera de Python
FROM python:3.10-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia sólo requirements primero para aprovechar cache
COPY requirements.txt .

# Instala dependencias sin cache pip
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Variables de entorno para Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV FLASK_RUN_HOST=0.0.0.0

# Exponer puerto
EXPOSE 5000

# Comando por defecto: ejecuta con Gunicorn para producción ligera
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
