import React from 'react';
import { Link } from 'react-router-dom';

const Lista_tareas = ({ tareas }) => {
  return (
    <div className='contenedor'>
      <h1>Lista de Tareas</h1>
      <ul>
        {tareas.map(tarea => (
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