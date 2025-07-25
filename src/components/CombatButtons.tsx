"use client";
import styles from "./CombatButtons.module.css";

type CombatButtonsProps = {
  onAttack: (type: "normal" | "special") => void;
  onReplay: () => void;
  onBack: () => void;
  playerHealth: number;
  opponentHealth: number;
  playerSpecialUsed: boolean;
  initialPlayerHealth: number;
};

export default function CombatButtons({
  onAttack,
  onReplay,
  onBack,
  playerHealth,
  opponentHealth,
  playerSpecialUsed,
  initialPlayerHealth,
}: CombatButtonsProps) {
  const canUseSpecial =
    !playerSpecialUsed && playerHealth <= initialPlayerHealth * 0.5;

  const isDisabled = playerHealth <= 0 || opponentHealth <= 0;

  return (
    <div className={styles.controls}>
      {" "}
      {isDisabled ? (
        <>
          <button onClick={onReplay} className={styles.replayButton}>
            {" "}
            Rejouer
          </button>
          <button onClick={onBack} className={styles.backButton}>
            {" "}
            Retour à la sélection
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onAttack("normal")}
            disabled={isDisabled}
            className={`${styles.button} ${styles.normalAttackButton}`}
          >
            Attaque normale
          </button>
          <button
            onClick={() => onAttack("special")}
            disabled={!canUseSpecial || isDisabled}
            className={`${styles.button} ${styles.specialAttackButton}`}
          >
            Attaque spéciale
          </button>
        </>
      )}
    </div>
  );
}
