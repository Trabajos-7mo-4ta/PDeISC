import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListaUsuarios from "./Components/ListaUsuarios";
import CrearUsuario from "./Components/CrearUsuario";
import EditarUsuario from "./Components/EditarUsuario";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListaUsuarios />} />
        <Route path="/crear" element={<CrearUsuario />} />
        <Route path="/editar/:id" element={<EditarUsuario />} />
      </Routes>
    </Router>
  );
}

export default App;