import { Fighter } from "@/model/Fighter";

interface PlayerAttackParams {
  selectedFighter: Fighter;
  opponent: Fighter;
  attackType: "normal" | "special";
  playerSpecialUsed: boolean;
  setSelectedFighter: (fighter: Fighter) => void;
  setOpponent: (fighter: Fighter) => void;
  setPlayerSpecialUsed: (used: boolean) => void;
  onVictory: () => void;
  onOpponentTurn: () => void;
}

export function handlePlayerAttack({
  selectedFighter,
  opponent,
  attackType,
  playerSpecialUsed,
  setOpponent,
  setPlayerSpecialUsed,
  onVictory,
  onOpponentTurn,
}: PlayerAttackParams): void {
  if (opponent.currentHealth <= 0 || selectedFighter.currentHealth <= 0) {
    return;
  }

  if (
    attackType === "special" &&
    (playerSpecialUsed ||
      selectedFighter.currentHealth > selectedFighter.maxHealth * 0.5)
  ) {
    alert(
      "L'attaque spéciale ne peut être utilisée qu'une fois et lorsque votre vie est inférieure à 50% !"
    );
    return;
  }

  if (attackType === "special") {
    setPlayerSpecialUsed(true);
  }

  const attack = selectedFighter.attack[attackType];
  let damageToDeal = attack.damage;
  let bonusDamage = 0;

  if (attackType === "normal") {
    bonusDamage = Math.floor(Math.random() * 3) + 1;
    damageToDeal += bonusDamage;
  }

  const newOpponentHealth = Math.max(opponent.currentHealth - damageToDeal, 0);
  setOpponent({ ...opponent, currentHealth: newOpponentHealth });

  let alertMessage = `${selectedFighter.name} utilise ${attack.name} et inflige ${damageToDeal} dégâts !`;

  alert(alertMessage);

  if (newOpponentHealth === 0) {
    alert("Victoire !");
    onVictory();
    return;
  }

  setTimeout(() => onOpponentTurn(), 500);
}
