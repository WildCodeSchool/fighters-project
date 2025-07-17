"use client";

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
  // les props permettent de passer des données au composant CombatButtons et les : CombatButtonsProps définissent le type de ces props
  const canUseSpecial =
    !playerSpecialUsed && playerHealth <= initialPlayerHealth * 0.5;

  const isDisabled = playerHealth <= 0 || opponentHealth <= 0;

  return (
    <div>
      {isDisabled ? (
        <>
          <button onClick={onReplay}>Rejouer</button>
          <button onClick={onBack}>Retour à la sélection</button>
        </>
      ) : (
        <>
          <button onClick={() => onAttack("normal")} disabled={isDisabled}>
            Attaque normale
          </button>
          <button
            onClick={() => onAttack("special")}
            disabled={!canUseSpecial || isDisabled}
          >
            Attaque spéciale
          </button>
        </>
      )}
    </div>
  );
}
