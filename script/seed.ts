import "dotenv/config";
import mysql from "mysql2/promise";

const { MYSQL_DB_HOST, MYSQL_DB_USER, MYSQL_DB_PASSWORD, MYSQL_DB_NAME } =
  process.env;

const infoData = [
  {
    title: "Partial Prerendering",
    content:
      "Next.js 15 introduit le rendu partiel côté serveur pour une expérience utilisateur ultra fluide.",
  },
  {
    title: "React 19 intégré",
    content:
      "Next.js 15 exploite React 19 pour des performances boostées avec le streaming SSR natif.",
  },
];

const fightersData = [
  { name: "Ryu", health: 100, style: "Karate" },
  { name: "Ken", health: 100, style: "Ansatsuken" },
  { name: "Chun-Li", health: 90, style: "Kung-Fu" },
];

const combatsData = [
  { fighter1_id: 1, fighter2_id: 2, winner_id: 1 },
  { fighter1_id: 2, fighter2_id: 3, winner_id: 3 },
];

const seed = async () => {
  try {
    const db = await mysql.createConnection({
      host: MYSQL_DB_HOST,
      user: MYSQL_DB_USER,
      password: MYSQL_DB_PASSWORD,
      database: MYSQL_DB_NAME,
    });

    await db.query("SET FOREIGN_KEY_CHECKS = 0");

    await db.query("TRUNCATE TABLE combats");
    await db.query("TRUNCATE TABLE fighters");
    await db.query("TRUNCATE TABLE info");

    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    for (const { title, content } of infoData) {
      await db.query("INSERT INTO info (title, content) VALUES (?, ?)", [
        title,
        content,
      ]);
    }

    for (const { name, health, style } of fightersData) {
      await db.query(
        "INSERT INTO fighters (name, health, style) VALUES (?, ?, ?)",
        [name, health, style]
      );
    }

    for (const { fighter1_id, fighter2_id, winner_id } of combatsData) {
      await db.query(
        "INSERT INTO combats (fighter1_id, fighter2_id, winner_id) VALUES (?, ?, ?)",
        [fighter1_id, fighter2_id, winner_id]
      );
    }

    await db.end();
    console.log("🌱 Base de données seedée avec succès");
  } catch (err) {
    console.error("❌ Erreur lors du seed :", err);
  }
};

seed();
