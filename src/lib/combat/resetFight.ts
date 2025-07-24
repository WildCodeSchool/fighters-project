import { Fighter } from "@/model/Fighter";
import { generateRandomOpponent } from "@/lib/combat/generateRandomOpponent";

interface ResetFightParams {
  selectedFighter: Fighter;
  setSelectedFighter: (fighter: Fighter) => void;
  setOpponent: (fighter: Fighter | null) => void;
  setPlayerSpecialUsed: (used: boolean) => void;
  setOpponentSpecialUsed: (used: boolean) => void;
}

export function resetFight({
  selectedFighter,
  setSelectedFighter,
  setOpponent,
  setPlayerSpecialUsed,
  setOpponentSpecialUsed,
}: ResetFightParams): void {
  const resetPlayer = {
    ...selectedFighter,
    currentHealth: selectedFighter.maxHealth,
  };
  setSelectedFighter(resetPlayer);
  setPlayerSpecialUsed(false);

  const newOpponent = generateRandomOpponent(selectedFighter);
  if (newOpponent) {
    setOpponent(newOpponent);
    setOpponentSpecialUsed(false);
    localStorage.setItem("opponentName", newOpponent.name);
  } else {
    setOpponent(null);
  }
}
