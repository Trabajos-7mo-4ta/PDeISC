import { useState } from "react";
import "../App.css"


export default function Formulario_simple() {
  const [nombre, setNombre] = useState("");
  const [enviado, setEnviado] = useState(false);

  const manejarSubmit = (e) => {
    e.preventDefault();
    if (nombre.trim() === "") return;
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
        </form>
      ) : (
        <h2>Bienvenido {nombre}!</h2>
      )}

      <br /><br /><br /><br /><br />

    </div>
  );
}