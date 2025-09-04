import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/EditarUsuario.css";

function EditarUsuario() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/usuarios/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    obtenerUsuario();
  }, [id]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => v.toString().trim() === "")) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/usuarios/${id}`, form);
      navigate("/");
    } catch (error) {
      console.error("Error al editar usuario:", error);
    }
  };

  return (
    <div className="editar-container">
      <h2>Editar Usuario</h2>
      {error && <p className="mensaje-error">{error}</p>}
      <form className="editar-form" onSubmit={handleSubmit}>
        <label>
          <p>Nombre</p>
          <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
        </label>

        <label>
          <p>Apellido</p>
          <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} />
        </label>

        <label>
          <p>Dirección</p>
          <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} />
        </label>

        <label>
          <p>Teléfono</p>
          <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        </label>

        <label>
          <p>Celular</p>
          <input name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} />
        </label>

        <label>
          <p>Fecha de Nacimiento</p>
          <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
        </label>

        <label>
          <p>Email</p>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          <p>Documento</p>
          <input name="documento" placeholder="Documento" value={form.documento} onChange={handleChange} />
        </label>


          <button type="submit">Guardar Cambios</button>
          <button type="button" onClick={() => navigate("/")}>Volver</button>
      </form>
    </div>
  );
}

export default EditarUsuario;