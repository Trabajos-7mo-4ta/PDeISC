import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/ListaUsuarios.css";  // 👈 importa CSS

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:3001/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/usuarios/${id}`);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <div className="lista-container">
      <h2>Lista de Usuarios</h2>
      <button onClick={() => navigate("/crear")}>Crear Usuario</button>
      <table className="lista-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Celular</th>
            <th>Fecha Nacimiento</th>
            <th>Email</th>
            <th>Documento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td data-label="Nombre">{u.nombre}</td>
              <td data-label="Apellido">{u.apellido}</td>
              <td data-label="Dirección">{u.direccion}</td>
              <td data-label="Teléfono">{u.telefono}</td>
              <td data-label="Celular">{u.celular}</td>
              <td data-label="Fecha Nacimiento">
                {new Date(u.fecha_nacimiento).toLocaleDateString("es-AR")}
              </td>
              <td data-label="Email">{u.email}</td>
              <td data-label="Documento">{u.documento}</td>
              <td data-label="Acciones">
                <button onClick={() => navigate(`/editar/${u.id}`)}>Modificar</button>
                <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaUsuarios;