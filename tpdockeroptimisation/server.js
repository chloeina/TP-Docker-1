const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();


// Middleware verbeux et un peu inutile
app.use((req, res, next) => {
console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
next();
});


app.get('/', (req, res) => {
res.send('Hello world — serveur volontairement non optimisé mais fonctionnel');
});


app.get('/big', async (req, res) => {
try {
    const filePath = path.join(__dirname, 'maybe-big-file.txt');
    await fs.promises.access(filePath);

    res.type('text'); // envoyer en texte brut
    const stream = fs.createReadStream(filePath, 'utf8');
    stream.pipe(res);
  } catch (error) {
  console.error('Erreur lors de la lecture du fichier:', error.message);
  res.status(404).send('Fichier introuvable');
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Serveur démarré sur le port ${PORT}`);
});