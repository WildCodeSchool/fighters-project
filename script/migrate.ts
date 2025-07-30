import "dotenv/config";
import mysql from "mysql2/promise";

const { MYSQL_DB_HOST, MYSQL_DB_USER, MYSQL_DB_PASSWORD, MYSQL_DB_NAME } =
  process.env;

const schema = `
  CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  USE \`${MYSQL_DB_NAME}\`;

  CREATE TABLE IF NOT EXISTS info (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS fighters (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    health INT NOT NULL,
    style VARCHAR(50) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS combats (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fighter1_id INT NOT NULL,
    fighter2_id INT NOT NULL,
    winner_id INT,
    FOREIGN KEY (fighter1_id) REFERENCES fighters(id) ON DELETE CASCADE,
    FOREIGN KEY (fighter2_id) REFERENCES fighters(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES fighters(id) ON DELETE SET NULL
  );
`;

const migrate = async () => {
  try {
    const connection = await mysql.createConnection({
      host: MYSQL_DB_HOST,
      user: MYSQL_DB_USER,
      password: MYSQL_DB_PASSWORD,
      multipleStatements: true,
    });

    await connection.query(schema);
    await connection.end();

    console.log("✅ Schéma de la base de données créé avec succès !");
  } catch (err) {
    console.error("❌ Erreur pendant la migration :", err);
  }
};

migrate();
