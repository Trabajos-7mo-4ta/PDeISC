import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lista_tareas from './Components/Lista_tareas';
import Detalles_tareas from './Components/Detalles_tareas';
import Crear_tareas from './Components/Crear_tareas';
import tareasData from './Datos/Tareas'; 

const App = () => {
  const [tareas, setTareas] = useState(tareasData);

  const agregarTarea = (nuevaTarea) => {
    setTareas([...tareas, nuevaTarea]); 
  };

  const borrarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  const cambiarEstadoTarea = (id) => {
    setTareas(
      tareas.map(t =>
        t.id === id ? { ...t, estado: !t.estado } : t
      )
    );
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Lista_tareas tareas={tareas} />} />
          <Route path="/tarea/:tareaId" element={<Detalles_tareas tareas={tareas} borrarTarea={borrarTarea} cambiarEstadoTarea={cambiarEstadoTarea} />} />
          <Route path="/crear" element={<Crear_tareas agregarTarea={agregarTarea} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;