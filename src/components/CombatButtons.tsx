"use client";
import React from "react";
import styles from "./CombatButtons.module.css";

interface CombatButtonsProps {
  onAttack: (type: "normal" | "special") => void;
  onReplay: () => void;
  onBack: () => void;
  playerHealth: number;
  opponentHealth: number;
  playerSpecialUsed: boolean;
  initialPlayerHealth: number;
  disableButtons: boolean;
}

const CombatButtons: React.FC<CombatButtonsProps> = ({
  onAttack,
  onReplay,
  onBack,
  playerHealth,
  opponentHealth,
  playerSpecialUsed,
  initialPlayerHealth,
  disableButtons,
}) => {
  const isPlayerLowHealth = playerHealth <= initialPlayerHealth * 0.5;
  const isCombatOver = playerHealth <= 0 || opponentHealth <= 0;

  return (
    <div className={styles.controls}>
      {" "}
      {!isCombatOver && (
        <>
          <button
            onClick={() => onAttack("normal")}
            className={`${styles.button} ${styles.normalAttackButton}`}
            disabled={disableButtons}
          >
            Attaque Normale
          </button>
          <button
            onClick={() => onAttack("special")}
            className={`${styles.button} ${styles.specialAttackButton}`}
            disabled={disableButtons || playerSpecialUsed || !isPlayerLowHealth}
          >
            Attaque Spéciale
            {playerSpecialUsed}
          </button>
        </>
      )}
      {isCombatOver && (
        <>
          <button onClick={onReplay} className={styles.replayButton}>
            Rejouer
          </button>
          <button onClick={onBack} className={styles.backButton}>
            Retour à la sélection
          </button>
        </>
      )}
    </div>
  );
};

export default CombatButtons;
