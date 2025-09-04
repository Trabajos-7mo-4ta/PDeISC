import { useState } from "react";
import "../App.css";

export default function Lista_tareas() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [mensaje, setMensaje] = useState("");

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") {
      setMensaje("La tarea no puede estar vacia");
      return;
    }

    if (/^\d+$/.test(nuevaTarea)) {
      setMensaje("La tarea no puede contener solo numeros");
      return;
    }

    setTareas([...tareas, { texto: nuevaTarea, completada: false }]);
    setNuevaTarea("");
    setMensaje("");
  };

  const alternarCompletada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].completada = !nuevasTareas[index].completada;
    setTareas(nuevasTareas);
  };

  return (
    <div className="Contenedor">
      <h2>Lista de Tareas</h2>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
      />
      <button onClick={agregarTarea}>Agregar</button>
      {mensaje && <p className="error">{mensaje}</p>}

      <ul>
        {tareas.map((tarea, index) => (
          <li
            key={index}
            onClick={() => alternarCompletada(index)}
            style={{
              textDecoration: tarea.completada ? "line-through" : "none",
              cursor: "pointer"
            }}
          >
            {tarea.texto}
          </li>
        ))}
      </ul>
    </div>
  );
}