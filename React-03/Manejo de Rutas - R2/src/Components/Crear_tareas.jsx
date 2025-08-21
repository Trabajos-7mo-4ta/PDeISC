import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Crear_tareas = ({ agregarTarea }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevaTarea = {
      id: Date.now(),  // Usamos Date.now() para darle de valor un id unico temporal
      title: titulo,
      description: descripcion,
      createdAt: new Date().toLocaleDateString(),
      completed: estado,
    };
    agregarTarea(nuevaTarea);
    navigate('/');  // Cuando termina de crear la tarea se redirige a la lista de tareas
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear Nueva Tarea</h1>
      <div>
        <label>Título:</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div>
        <label>
          Completada:
          <input
            type="checkbox"
            checked={estado}
            onChange={() => setEstado(!estado)}
          />
        </label>
      </div>
      <button type="submit">Crear tarea</button>
    </form>
  );
};

export default Crear_tareas;