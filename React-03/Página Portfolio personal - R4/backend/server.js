import express from "express";
import cors from "cors";
import pool from "./dbconection.js";

const app = express();
app.use(cors());
app.use(express.json());

/* -------- SOBRE MI -------- */
app.get("/sobre_mi", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sobre_mi LIMIT 1");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ahora usamos :id
app.put("/sobre_mi/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;

    const result = await pool.query(
      "UPDATE sobre_mi SET contenido=$1 WHERE id=$2 RETURNING *",
      [contenido, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "No existe contenido" });
    }

    res.json({ mensaje: "Contenido actualizado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* -------- HABILIDADES -------- */
app.get("/habilidades", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM habilidades");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/habilidades", async (req, res) => {
  try {
    const { nombre } = req.body;
    const result = await pool.query(
      "INSERT INTO habilidades (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.json({ mensaje: "Habilidad agregada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/habilidades/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre } = req.body;

    const result = await pool.query(
      "UPDATE habilidades SET nombre=$1 WHERE id=$2 RETURNING *",
      [nombre, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Habilidad no encontrada" });
    }

    res.json({ mensaje: "Habilidad actualizada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/habilidades/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const result = await pool.query(
      "DELETE FROM habilidades WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Habilidad no encontrada" });
    }

    res.json({ mensaje: "Habilidad eliminada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* -------- LOGROS -------- */
app.get("/logros", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM logros");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logros", async (req, res) => {
  try {
    const { descripcion } = req.body;
    const result = await pool.query(
      "INSERT INTO logros (descripcion) VALUES ($1) RETURNING *",
      [descripcion]
    );
    res.json({ mensaje: "Logro agregado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/logros/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { descripcion } = req.body;

    const result = await pool.query(
      "UPDATE logros SET descripcion=$1 WHERE id=$2 RETURNING *",
      [descripcion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Logro no encontrado" });
    }

    res.json({ mensaje: "Logro actualizado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/logros/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const result = await pool.query(
      "DELETE FROM logros WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Logro no encontrado" });
    }

    res.json({ mensaje: "Logro eliminado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------- EXPERIENCIA -------- */
app.get("/experiencia", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM experiencia");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/experiencia", async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const result = await pool.query(
      "INSERT INTO experiencia (titulo, descripcion) VALUES ($1, $2) RETURNING *",
      [titulo, descripcion]
    );
    res.json({ mensaje: "Experiencia agregada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/experiencia/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { titulo, descripcion } = req.body;

    const result = await pool.query(
      "UPDATE experiencia SET titulo=$1, descripcion=$2 WHERE id=$3 RETURNING *",
      [titulo, descripcion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Experiencia no encontrada" });
    }

    res.json({ mensaje: "Experiencia actualizada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/experiencia/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const result = await pool.query(
      "DELETE FROM experiencia WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Experiencia no encontrada" });
    }

    res.json({ mensaje: "Experiencia eliminada", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* -------- PROYECTOS -------- */
app.get("/proyectos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM proyectos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/proyectos", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const result = await pool.query(
      "INSERT INTO proyectos (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [nombre, descripcion]
    );
    res.json({ mensaje: "Proyecto agregado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/proyectos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, descripcion } = req.body;

    const result = await pool.query(
      "UPDATE proyectos SET nombre=$1, descripcion=$2 WHERE id=$3 RETURNING *",
      [nombre, descripcion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.json({ mensaje: "Proyecto actualizado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/proyectos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const result = await pool.query(
      "DELETE FROM proyectos WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: "Proyecto no encontrado" });
    }

    res.json({ mensaje: "Proyecto eliminado", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* -------- LOGIN ADMIN -------- */
app.post("/login", async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE usuario=$1 AND contraseña=$2",
      [usuario, contraseña]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }

    res.json({ mensaje: "Login exitoso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
