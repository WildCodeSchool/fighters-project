import { Fighter } from "@/model/Fighter";

type AttackType = "normal" | "special";

interface ExecuteAttackParams {
  attacker: Fighter;
  defender: Fighter;
  type: AttackType;
  specialUsed: boolean;
  setDefender: (updatedFighter: Fighter) => void;
  setSpecialUsed: (used: boolean) => void;
  onVictory: () => void;
  onNextTurn: () => void;
}

export function executePlayerAttack({
  attacker,
  defender,
  type,
  specialUsed,
  setDefender,
  setSpecialUsed,
  onVictory,
  onNextTurn,
}: ExecuteAttackParams): void {
  if (defender.currentHealth <= 0 || attacker.currentHealth <= 0) return;

  if (type === "special") {
    if (specialUsed || attacker.currentHealth > attacker.maxHealth * 0.5) {
      alert(
        "L'attaque spéciale ne peut être utilisée qu'une fois et uniquement à moins de 50 % de vie !"
      );
      return;
    }
    setSpecialUsed(true);
  }

  const attack = attacker.attack[type];
  let damage = attack.damage;
  let bonus = 0;

  if (type === "normal") {
    bonus = Math.floor(Math.random() * 3) + 1;
    damage += bonus;
  }

  const newHealth = Math.max(defender.currentHealth - damage, 0);
  setDefender({ ...defender, currentHealth: newHealth });

  let message = `${attacker.name} utilise ${attack.name} et inflige ${damage} dégâts !`;
  if (bonus > 0) {
    message += ` (+${bonus} dégâts bonus)`;
  }

  alert(message);

  if (newHealth === 0) {
    onVictory();
    return;
  }

  setTimeout(() => onNextTurn(), 500);
}
