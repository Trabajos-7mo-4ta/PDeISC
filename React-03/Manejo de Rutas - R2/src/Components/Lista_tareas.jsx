import React from 'react';
import { Link } from 'react-router-dom';
import tareasData from '../Datos/Tareas';

const Lista_tareas = () => {
  return (
    <div>
      <h1>Lista de Tareas</h1>
      <ul>
        {tareasData.map(tarea => (
          <li key={tarea.id}>
            <Link to={`/tarea/${tarea.id}`}>
              {tarea.titulo} - {tarea.descripcion}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/crear">Crear nueva tarea</Link>
    </div>
  );
};

export default Lista_tareas;