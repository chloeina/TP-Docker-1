# Test de docker images
C:\Users\henry\Documents\MIAGE\intégration\TP-integration> docker images
REPOSITORY         TAG       IMAGE ID       CREATED       SIZE
tpdocker-web       latest    8a7b4d0182ff   10 days ago   212MB
flask-docker-app   latest    5a9439585334   10 days ago   200MB
mongo              6         95ec2fde0ea4   2 weeks ago   1.05GB
nginx              latest    33e0bbc7ca9e   4 weeks ago   279MB

# Mauvaises pratiques & améliorations du fichier dockerFile
1ère mauvaise pratique
FROM node:latest => latest rend l'image non reproductible

2ème mauvaise pratique
COPY node_modules ./node_modules => copier node_modules locaux dans l'image peut causer des problèmes de compatibilité

3ème mauvaise pratique
COPY . /app
RUN npm install => en copiant tout avant d'installer, le cache Docker est effacer à chaque changement dans le code

4ème mauvaise pratique
RUN apt-get update && apt-get install -y build-essential ca-certificates locales => l'image est plus lourde

5ème
EXPOSE 3000 4000 5000 => inutile d'en avoir 3

6ème
ENV NODE_ENV=development => rique de performance et de sécurité

7ème
RUN npm run build => gros risque de sécurité

8ème 
USER root => laisser le serveur tourner en root peut avoir des attaques potentielle malveillantes

9ème 
CMD ["node", "server.js"] => peu flexible

# Mauvaises pratiques & améliorations du fichier server.js