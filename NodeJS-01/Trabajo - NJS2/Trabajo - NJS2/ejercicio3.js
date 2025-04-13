const url = require('url');//Usamos el modulo url
const link1 = 'https://www.youtube.com/results?search_query=nodejs';//La url que elegi es la pagina de youtube buscando nodejs en el buscador
const q = url.parse(link1, true);//Usamos la funcion "parse" con la variable link para usar la url que elegimos

console.log("Nombre del primer servidor:",q.host);//La funcion "host" muestra la primera parte del link
console.log("Camino del primer servidor:",q.pathname);//La funcion "pathname" muestra el camino despues del nombre del url
console.log("Que se esta buscando?:",q.search); //La funcion "search" muestra lo seguido del caracter "?", despues del path


const link2='https://github.com/Trabajos-7mo-4ta/PDeISC';//Repetimos pero ahora con mi pagina de github
const a = url.parse(link2, true);
console.log("Nombre del segundo servidor:",a.host);
console.log("Camino del segundo servidor:",a.pathname);