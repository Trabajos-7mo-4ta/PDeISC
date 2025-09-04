import { useState } from "react";
import "../App.css";

export default function Formulario_simple() {
  const [nombre, setNombre] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejarSubmit = (e) => {
    e.preventDefault();

    if (nombre.trim() === "") {
      setMensaje("El campo no puede estar vacio");
      return;
    }

    if (/^\d+$/.test(nombre)) {
      setMensaje("No se pueden ingresar solamente numeros");
      return;
    }

    setMensaje("");
    setEnviado(true);
  };

  return (
    <div className="Contenedor">
      {!enviado ? (
        <form onSubmit={manejarSubmit}>
          <input
            type="text"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <button type="submit">Enviar</button>
          {mensaje && <p className="error">{mensaje}</p>}
        </form>
      ) : (
        <h2>Bienvenido {nombre}!</h2>
      )}
    </div>
  );
}