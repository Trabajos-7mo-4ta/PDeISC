const t= require('./tiempo.js');//Usamos el modulo tiempo
const s= require('./matematicas.js');//Usamos el modulo matematicas
const h= require('./saludo.js');//Usamos el modulo saludo

h.crearSaludo();//Llamamos a la funcion "crearSaludo" del modulo saludo
console.log("El horario actual es:",t.tiempoActual());//Usamos la funcion "tiempoActual" del modulo tiempo

var n1=100;
var n2=50;
console.log("La suma de ",n1,"+",n2," es = ",s.crearSuma(n1,n2));//Usamos la funcion "crearSuma" del modulo matematicas
console.log("La resta de ",n1,"-",n2," es = ",s.crearResta(n1,n2));//Usamos la funcion "crearResta" del modulo matematicas
console.log("La multiplicacion de ",n1,"*",n2," es = ",s.crearMultiplicacion(n1,n2));//Usamos la funcion "crearMultiplicacion" del modulo matematicas
console.log("La division de ",n1,"/",n2," es = ",s.crearDivision(n1,n2));//Usamos la funcion "crearDivision" del modulo matematicas
