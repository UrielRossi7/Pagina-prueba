const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta para procesar la descarga
app.post('/download', (req, res) => {
const { url } = req.body;

if (!url) {
    return res.status(400).json({ error: 'URL no proporcionada' });
}

const outputPath = path.join(__dirname, 'downloads', `${Date.now()}.mp3`);
const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" ${url}`;

exec(command, (error) => {
    if (error) {
    console.error('Error al descargar:', error);
    return res.status(500).json({ error: 'Error al procesar el archivo' });
    }
    res.json({ downloadUrl: `https://tu-backend.herokuapp.com/downloads/${path.basename(outputPath)}` });
});
});

// Servir los archivos descargados
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionando en el puerto ${PORT}`));
