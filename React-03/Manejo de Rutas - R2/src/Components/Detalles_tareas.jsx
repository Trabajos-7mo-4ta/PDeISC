import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/Detalles.css'

const Detalles_tareas = ({ tareas, borrarTarea, cambiarEstadoTarea }) => {
  const { tareaId } = useParams();
  const navigate = useNavigate();
  const tarea = tareas.find(t => t.id === parseInt(tareaId));

  if (!tarea) {
    return <div>Tarea no encontrada</div>;
  }

  const handleBorrar = () => {
    borrarTarea(tarea.id);
    navigate("/");
  };

  const handleCambiarEstado = () => {
    cambiarEstadoTarea(tarea.id);
  };

  return (
    <div className='detalles'>
      <h1>{tarea.titulo}</h1>
      <p>{tarea.descripcion}</p>
      <p>Fecha de creación: {tarea.fecha_creacion}</p>
      <p>Estado: {tarea.estado ? "Completada" : "Incompleta"}</p>

      <button className='estado' onClick={handleCambiarEstado}>
        Marcar como {tarea.estado ? "Incompleta" : "Completada"}
      </button>
      <button className='borrar' onClick={handleBorrar}>
        Borrar tarea
      </button>

      <div>
        <button className='volver' onClick={() => navigate('/')}>Volver</button>
      </div>
    </div>
  );
};

export default Detalles_tareas;