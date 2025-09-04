import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Lista.css'

const Lista_tareas = ({ tareas }) => {
  return (
    <div className='lista'>
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
      <button><Link to="/crear">Crear nueva tarea</Link></button>
    </div>
  );
};

export default Lista_tareas;