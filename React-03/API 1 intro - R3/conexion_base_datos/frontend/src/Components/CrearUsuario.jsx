import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/CrearUsuario.css"; 

function CrearUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    celular: "",
    fecha_nacimiento: "",
    email: "",
    documento: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((v) => v.trim() === "")) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/usuarios", form);
      navigate("/");
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <div className="crear-container">
      <h2>Crear Usuario</h2>
      {error && <p className="mensaje-error">{error}</p>}
      <form className="crear-form" onSubmit={handleSubmit}>
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

        <button type="submit">Guardar</button>
        <button type="button" onClick={() => navigate("/")}>Volver</button>
      </form>
    </div>
  );
}

export default CrearUsuario;