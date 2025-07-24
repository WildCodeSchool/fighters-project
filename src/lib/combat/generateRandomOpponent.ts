import { Fighter } from "@/model/Fighter";
import { fighters } from "@/data/fighters";

export function generateRandomOpponent(playerFighter: Fighter): Fighter | null {
  const possibleOpponents = fighters.filter(
    (opp) => opp.id !== playerFighter.id
  );

  if (possibleOpponents.length === 0) {
    console.warn("Aucun autre combattant disponible pour être un adversaire.");
    return null;
  }

  const randomOpponent =
    possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];

  const newOpponent: Fighter = {
    ...randomOpponent,
    currentHealth: randomOpponent.maxHealth,
  };

  return newOpponent;
}
