// Cargar el módulo HTTP de Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Crear un servidor HTTP
const server = http.createServer((req, res) => {
    // Establecer el encabezado para indicar que es un archivo HTML
    res.writeHead(200, {'Content-Type': 'text/html'});

    // Leer el archivo HTML y enviarlo como respuesta
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Error al leer el archivo.');
            return;
        }
        res.end(data);
    });
});

// Establecer el puerto en el que se ejecutará el servidor
const port = 3000;
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});