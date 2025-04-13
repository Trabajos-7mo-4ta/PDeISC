//Primero descargaremos el modulo "upper-case" en la terminal con el comando "npm install upper-case"
//Al ejecutar el comando, el modulo se guardara en una nueva carpeta llamada "node_modules"
//Este modulo nos dara funciones para pasar una cadena de texto, de minuscula a mayuscula

const up=require('upper-case');//LLamamos al modulo instalado

var txt="hola como estas";
console.log("Texto inicial: ",txt);
console.log("Texto cambiado: ",up.upperCase(txt));//Cambiamos el texto usando la funcion "uppercase"