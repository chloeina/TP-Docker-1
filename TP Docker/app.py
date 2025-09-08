from flask import Flask
from pymongo import MongoClient
import os

app = Flask(__name__)

# Connexion à MongoDB (nom d'hôte = nom du service Docker Compose)
mongo_host = os.environ.get('MONGO_HOST', 'mongodb')
mongo_port = int(os.environ.get('MONGO_PORT', 27017))

client = MongoClient(host=mongo_host, port=mongo_port)
db = client['mydatabase']
collection = db['mycollection']

@app.route('/')
def index():
    # Insertion de test
    collection.insert_one({"message": "Hello from Flask to MongoDB!"})
    count = collection.count_documents({})
    return f"Connexion MongoDB OK. Documents dans la collection : {count}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
