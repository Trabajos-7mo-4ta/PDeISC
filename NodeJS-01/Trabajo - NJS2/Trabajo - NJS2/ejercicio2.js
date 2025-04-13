var http = require('http');//Usamos el modulo hhtp para crear el servidor
var fs = require('fs');//Usamos el modulo file sistem para meter una pagina htmk dentro del servidor

http.createServer(function (req, res) {
  fs.readFile('paginaEjercicio2.html', function(err, data) {//En esta parte agregamos el nombre del archivo que contiene la pagina
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);//Elegimos el host 8080

console.log("Si nada salio mal, la pagina ya deberia estar subida en 'localhost:8080'");
