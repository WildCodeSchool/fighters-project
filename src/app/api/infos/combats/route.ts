import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export async function POST(req: Request) {
  try {
    const { fighter1_id, fighter2_id, winner_id } = await req.json();

    if (!fighter1_id || !fighter2_id) {
      return NextResponse.json(
        { error: "fighter1_id et fighter2_id sont requis" },
        { status: 400 }
      );
    }

    const [result] = (await db.query(
      "INSERT INTO combats (fighter1_id, fighter2_id, winner_id, date) VALUES (?, ?, ?, NOW())",
      [fighter1_id, fighter2_id, winner_id || null]
    )) as [ResultSetHeader, unknown];

    return NextResponse.json({
      message: "Combat enregistré avec succès",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Erreur MySQL (POST) :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT
        c.id,
        f1.name AS fighter1_name,
        f2.name AS fighter2_name,
        fw.name AS winner_name,
        c.date
      FROM
        combats c
      JOIN
        fighters f1 ON c.fighter1_id = f1.id
      JOIN
        fighters f2 ON c.fighter2_id = f2.id
      LEFT JOIN
        fighters fw ON c.winner_id = fw.id
      ORDER BY c.date DESC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erreur MySQL (GET) :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
