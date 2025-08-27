import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Crear_tareas = ({ agregarTarea }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    const soloNumeros = /^\d+$/;
    if (!titulo.trim() || !descripcion.trim()) {
      setError("El titulo y la descripcion no pueden estar vacios.");
      return;
    }
    if (soloNumeros.test(titulo) || soloNumeros.test(descripcion)) {
      setError("No se pueden ingresar solamente caracteres numéricos.");
      return;
    }

    setError(''); // Si pasa la validacion, vacia el mensaje de error

    const nuevaTarea = {
      id: Date.now(),
      titulo: titulo,
      descripcion: descripcion,
      fecha_creacion: new Date().toLocaleDateString(),
      estado: estado,
    };

    agregarTarea(nuevaTarea);
    navigate('/');
  };

  return (
    <div className='contenedor'>
      <h1>Crear Nueva Tarea</h1>
      <form onSubmit={handleSubmit}>
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
            <input type="checkbox"
              checked={estado}
              onChange={() => setEstado(!estado)}
            />
          </label>
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Crear tarea</button>
      </form>

      <button onClick={() => navigate('/')}> Volver</button>
    </div>
  );
};

export default Crear_tareas;