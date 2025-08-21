import React from 'react';
import { useParams } from 'react-router-dom';
import tareasData from '../Datos/Tareas';

const Detalles_tareas = () => {
  const { tareaid } = useParams();
  const tarea = tareasData.find(tarea => tarea.id === parseInt(tareaid));

  if (!tarea) {
    return <div>Tarea no encontrada</div>;
  }

  return (
    <div>
      <h1>{tarea.titulo}</h1>
      <p>{tarea.descripcion}</p>
      <p>Fecha de creación: {tarea.fecha_creacion}</p>
      <p>Estado: {tarea.estado ? "Completada" : "Incompleta"}</p>
    </div>
  );
};

export default Detalles_tareas;