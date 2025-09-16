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

solution 
changer par RUN apk add --no-cache ca-certificates

5ème
EXPOSE 3000 4000 5000 => inutile d'en avoir 3

solution 
en choisir qu'un seul => 3000

6ème
ENV NODE_ENV=development => rique de performance et de sécurité

solution
remplacer development par production car on est en production

7ème
RUN npm run build => gros risque de sécurité

solution
on le retire

8ème 
USER root => laisser le serveur tourner en root peut avoir des attaques potentielle malveillantes

solution
créer un utilisateur non root

9ème 
CMD ["node", "server.js"] => peu flexible

solution
changer "server.js" => "dist/server.js"

# Mauvaises pratiques & améliorations du fichier server.js

1ère 
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}); => pas de gestion de niveau de log & pas de gestion des erreurs

solution 
ajout de constante morgan et helmet et réécriture du code pour la sécurité et les logs en plus cours

2ème 
if (fs.existsSync(filePath)) {
  const data = fs.readFileSync(filePath, 'utf8');
  res.send(data.replace(/\n/g, '<br/>'));
} => blocage du thread : existSync et readFileSync sont synchrones donc chaque requête bloque la boucle d'évènements

solution
utiliser une version asynchrone => fs.promises.readFile

3ème 
res.send(data.replace(/\n/g, '<br/>')); => risque de problèmes de sécurité si le contenu affiché est non échappé

solution
utilisation de stream.pipe(res) pour les gros fichiers

4ème
fs.readFileSync => si ça plante, l’application crashe

solution
gérer les erreurs avec try/catch => dans app.get('/big', async (req, res) => {}) mettre un try/catch

5ème
pas de séparation dev/prod => le logger, le message en dur et le comportement ne changent pas selon l’environnement

solution 
adapter avec NODE_ENV

6ème 
pas de header de sécurité => Express n'active pas de protections basiques par défaut

solution
ajouter helmet

7ème
const PORT = process.env.PORT || 3000; => port en clair dans le code

solution
il faudrait séparer la configuration

8ème
pas de gestion de la montée en charge => le code tourne en single-thread

soltuion 
utiliser un gestionnaire de processus Docker


# Mesure et comparaison des performances

docker images | findstr mon-app
mon-app            etape2    7cbfbb2bdc99   2 hours ago   1.57GB
mon-app            initial   59e708ea75d9   2 hours ago   1.73GB

suite aux motifications des trois premières mauvaise pratique et aux modifications des pratiques 2 et 4, on peut appercevoir que la taille de l'image est un peu plus petite donc demande moins de ressources.

# Optimisations avancées
mon-app            etape3    076785c2c906   11 seconds ago   1.47GB
mon-app            etape2    7cbfbb2bdc99   3 hours ago      1.57GB
mon-app            initial   59e708ea75d9   3 hours ago      1.73GB

comme on peut le voir, la taille de l'image continu à diminuer grâce aux modifications faites

docker run --rm williamyeh/wrk -t4 -c100 -d10s http://host.docker.internal:3000/
Running 10s test @ http://host.docker.internal:3000/
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    84.17ms  153.47ms   2.00s    96.89%
    Req/Sec   381.83     84.99   500.00     75.75%
  15382 requests in 9.85s, 13.39MB read
  Socket errors: connect 0, read 0, write 0, timeout 117
Requests/sec:   1560.84
Transfer/sec:      1.36MB

l'application supporte les 100 connexions simultanées. le temps de latence est raisonnables. les timeout indiquent que des threadq ont été chargés

docker exec -it mon-app-etape3 whoami
app

on peut également voir que ce n'est pas l'utilisateur root mais app

# Optimisation de gros fichiers
docker run -d -p 3000:3000 --name mon-app-etape4 mon-app:etape4
81e7b429165770268e88087082e7eff58070cca9dac3c7d7511927a0482a607b

rebuild de l'image 4 

docker exec -it mon-app-etape4 sh
$ ls /app
Dockerfile  maybe-big-file.txt  package-lock.json  server.js
README.md   node_modules        package.json

vérifie que le fichier est bien copié dans l'image Docker

docker images | findstr mon-app
mon-app            etape4    18696f5e0d8a   15 minutes ago   1.47GB
mon-app            etape3    076785c2c906   19 hours ago     1.47GB
mon-app            etape2    7cbfbb2bdc99   22 hours ago     1.57GB
mon-app            initial   59e708ea75d9   22 hours ago     1.73GB

on peut voir que la taille de l'image a nettement réduite de l'image initial à l'image 4.
cependant, la taille n'a pas différée entre l'image 3 et 4.

(Invoke-WebRequest -Uri "http://localhost:3000/" -Headers @{ "Accept-Encoding"="gzip" }).Headers                                                                                        
Key                               Value
---                               -----
Content-Security-Policy           default-src 'self';base-uri 'self';font-src 'self' https: d... 
Cross-Origin-Opener-Policy        same-origin
Cross-Origin-Resource-Policy      same-origin
Origin-Agent-Cluster              ?1
Referrer-Policy                   no-referrer
Strict-Transport-Security         max-age=31536000; includeSubDomains
X-Content-Type-Options            nosniff
X-DNS-Prefetch-Control            off
X-Download-Options                noopen
X-Frame-Options                   SAMEORIGIN
X-Permitted-Cross-Domain-Policies none
X-XSS-Protection                  0
Vary                              Accept-Encoding
Connection                        keep-alive
Keep-Alive                        timeout=5
Content-Length                    45
Content-Type                      text/html; charset=utf-8
Date                              Tue, 16 Sep 2025 16:10:56 GMT
ETag                              W/"2d-sFgRk0YfyGW18BUVJVxlEST9AgE"

objectif : route qui sert à tester le serveur avec un gros fichier.
pour vérifier que la compression gzip fonctionne dans ton serveur Express, teste la commande
en ajoutant maybe-big-file.txt dans le projet =>
ça test la compression gzip sur un fichier volumineux.
ça mesure l’impact sur le débit (Transfer/sec) et la latence avec wrk.

docker stats mon-app-etape4
CONTAINER ID   NAME             CPU %     MEM USAGE / LIMIT     MEM %     NET I/O          BLOCK I/O    PIDS
a3585228ef1e   mon-app-etape4   0.00%     12.89MiB / 7.578GiB   0.17%     3.9kB / 3.67kB   291kB / 0B   7

docker stats mon-app-etape3
CONTAINER ID   NAME             CPU %     MEM USAGE / LIMIT   MEM %     NET I/O   BLOCK I/O   PIDS
8c29f3c4cfdd   mon-app-etape3   0.00%     0B / 0B             0.00%     0B / 0B   0B / 0B     0

on peut voir que l'image 4 consomme peu de mémoire mais l'image 3 ne retourne pas sa consommation

Test de débit image étape 3 : 
docker run --rm williamyeh/wrk -t4 -c100 -d10s http://host.docker.internal:3000/
Running 10s test @ http://host.docker.internal:3000/
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    84.17ms  153.47ms   2.00s    96.89%
    Req/Sec   381.83     84.99   500.00     75.75%
  15382 requests in 9.85s, 13.39MB read
  Socket errors: connect 0, read 0, write 0, timeout 117
Requests/sec:   1560.84
Transfer/sec:      1.36MB

Test de débit image étape 4 : 
docker run --rm williamyeh/wrk -t4 -c100 -d10s http://host.docker.internal:3000/
Running 10s test @ http://host.docker.internal:3000/
  4 threads and 100 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   125.88ms  130.49ms   1.88s    96.24%
    Req/Sec   173.99     82.32   424.00     65.97%
  6653 requests in 10.20s, 5.94MB read
  Socket errors: connect 0, read 0, write 0, timeout 52
Requests/sec:    652.28
Transfer/sec:    596.22KB

le débit Transfer/sec a baissé (gzip envoie moins de données).
mais le nombre de requêtes/sec est plus faible (la compression a un coût CPU).


# Synthèse
le serveur est bien optimisé et bien fonctionnel (voir photo).
Après optimisation progressive du Dockerfile et du code Express, on constate :
Une réduction de la taille des images Docker (1.73 GB → 1.47 GB).
Une réduction de la consommation mémoire (≈13 MB en étape 4).
L’ajout de Helmet pour la sécurité (en-têtes HTTP visibles).
L’application ne tourne plus en root, mais avec un utilisateur dédié.
L’activation de la compression gzip, qui réduit la bande passante utilisée (Transfer/sec divisé par 2).
Cependant, la compression entraîne une latence plus élevée et moins de requêtes/sec, ce qui illustre le compromis classique entre performance brute et efficacité réseau.