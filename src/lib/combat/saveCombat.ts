import { Fighter } from "@/model/Fighter";

export async function saveCombat(
  playerFighter: Fighter,
  opponentFighter: Fighter,
  winnerId: number | null
): Promise<{ success: boolean; message: string }> {
  if (!playerFighter || !opponentFighter) {
    console.error(
      "Impossible d'enregistrer le combat : combattants manquants."
    );
    return { success: false, message: "Combattants manquants." };
  }

  const fightData = {
    fighter1_id: playerFighter.id,
    fighter2_id: opponentFighter.id,
    winner_id: winnerId,
  };

  try {
    const response = await fetch("/api/infos/combats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fightData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(
        "Combat enregistré avec succès :",
        data.message,
        data.insertedId
      );
      return { success: true, message: data.message };
    } else {
      const errorData = await response.json();
      console.error("Échec de l'enregistrement du combat :", errorData.error);
      return { success: false, message: errorData.error };
    }
  } catch (error) {
    console.error(
      "Erreur réseau ou inattendue lors de l'enregistrement :",
      error
    );
    return { success: false, message: "Erreur réseau ou inattendue." };
  }
}
