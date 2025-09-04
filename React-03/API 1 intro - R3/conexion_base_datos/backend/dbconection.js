import mysql from "mysql2/promise";

const dbconection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proyecto_3"
});

console.log("Conectado a MySQL");

export default dbconection;