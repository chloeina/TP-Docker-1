const express = require('express');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
res.send('Hello world — serveur optimisé fonctionnel');
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