import ImagenTarjeta from "../assets/imagen.png"
import "../App.css"

export default function Tarjeta_presentacion() {
  let nombre="Ezequiel";
  let apellido="Moyano";
  let profesion="programador";

    return (<div className="Contenedor">        
        <h3>Nombre: {nombre}</h3>
        <h3>Apellido: {apellido}</h3>
        <h3>Profesión: {profesion}</h3>
        <img src={ImagenTarjeta} alt="Imagen para la presentacion" />
    </div>
    );
}