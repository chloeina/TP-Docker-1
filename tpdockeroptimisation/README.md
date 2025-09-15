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

solution 
utiliser une version précise => node:20-bullseye

2ème mauvaise pratique
COPY node_modules ./node_modules => copier node_modules locaux dans l'image peut causer des problèmes de compatibilité

solution
ne jamais copier node_modules => suppression de la ligne

3ème mauvaise pratique
COPY . /app
RUN npm install => en copiant tout avant d'installer, le cache Docker est effacer à chaque changement dans le code

solution 
changer COPY . /app en COPY package*.json ./ & npm install en RUN npm ci
rajouter COPY ...

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

1ère 
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}); => pas de gestion de niveau de log & pas de gestion des erreurs

2ème 
if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, 'utf8');
  res.send(data.replace(/\n/g, '<br/>'));
} => blocage du thread : existSync et readFileSync sont synchrones donc chaque requête bloque la boucle d'évènements

solution
utiliser une version asynchrone => fs.promises.readFile

3ème 
res.send(data.replace(/\n/g, '<br/>')); => risque de problèmes de sécurité si le contenu affiché est non échappé

4ème
fs.readFileSync => si ça plante, l’application crashe

solution
gérer les erreurs avec try/catch => dans app.get('/big', async (req, res) => {}) mettre un try/catch

5ème
pas de séparation dev/prod => le logger, le message en dur et le comportement ne changent pas selon l’environnement

6ème 
pas de header de sécurité => Express n'active pas de protections basiques par défaut

7ème
const PORT = process.env.PORT || 3000; => port en clair dans le code

8ème
pas de gestion de la montée en charge => le code tourne en single-thread


# Mesure et comparaison des performances

docker images | findstr mon-app
mon-app            etape2    7cbfbb2bdc99   2 hours ago   1.57GB
mon-app            initial   59e708ea75d9   2 hours ago   1.73GB

suite aux motifications des trois premières mauvaise pratique et aux modifications des pratiques 2 et 4, on peut appercevoir que la taille de l'image est un peu plus petite donc demande moins de ressources.