# Utiliser une image officielle Python comme image de base
FROM python:3.10-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers nécessaires dans l'image
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Exposer le port sur lequel l'app écoute
EXPOSE 5000

# Commande pour lancer l'application Flask
CMD ["python", "app.py"]
