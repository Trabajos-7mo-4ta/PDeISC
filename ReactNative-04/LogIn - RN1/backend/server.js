const express = require('express');
const cors = require('cors');
const pool = require('./dbConnection');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  try {
    const result = await pool.query(
      'SELECT name FROM users WHERE email = $1 AND password = $2 LIMIT 1',
      [email, password]
    );

    if (result.rows.length === 1) {
      return res.json({ success: true, user: { name: result.rows[0].name } });
    } else {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);    
});
