import express from "express";
import cors from "cors";
import dbconection from "./dbconection.js";

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para mostrar usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await dbconection.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint para agregar un usuario
app.post("/usuarios", async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, documento } = req.body;
    const sql = "INSERT INTO usuarios (nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [result] = await dbconection.query(sql, [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, documento]);
    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Endpoint para mostrar un usuario especifico
app.get("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params; 
      const [rows] = await dbconection.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  
      if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
  
      res.json(rows[0]); 
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });




//Endpoint para modificar un usuario
  app.put("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, documento } = req.body;
  
      const sql = `UPDATE usuarios 
                   SET nombre=?, apellido=?, direccion=?, telefono=?, celular=?, fecha_nacimiento=?, email=?, documento=? 
                   WHERE id=?`;
  
      await dbconection.query(sql, [nombre, apellido, direccion, telefono, celular, fecha_nacimiento, email, documento, id]);
  
      res.json({ message: "Usuario actualizado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//Endpoint para eliminar un usuario
  app.delete("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await dbconection.query("DELETE FROM usuarios WHERE id = ?", [id]);
      res.json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});



