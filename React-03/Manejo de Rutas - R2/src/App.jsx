import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lista_tareas from './Components/Lista_tareas';
import Detalles_tareas from './Components/Detalles_tareas';
import Crear_tareas from './Components/Crear_tareas';
import tareasData from '../Datos/Tareas'; // Importamos los datos de tareas correctamente

const App = () => {
  const [tareas, setTareas] = useState(tareasData);

  const agregarTarea = (nuevaTarea) => {
    setTareas([...tareas, nuevaTarea]); 
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Lista_tareas />} />
          <Route path="/task/:taskId" element={<Detalles_tareas />} />
          <Route path="/create" element={<Crear_tareas agregarTarea={agregarTarea} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;