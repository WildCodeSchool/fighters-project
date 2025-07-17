"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fighters } from "@/data/fighters";
import { Fighter } from "@/model/Fighter";
import FighterCard from "@/components/FighterCard";
import CombatButtons from "@/components/CombatButtons";

export default function ArenaPage() {
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [opponent, setOpponent] = useState<Fighter | null>(null);

  const [playerSpecialUsed, setPlayerSpecialUsed] = useState<boolean>(false);
  const [opponentSpecialUsed, setOpponentSpecialUsed] =
    useState<boolean>(false);

  // handleOpponentAttack reste ici, car il est appelé par setTimeout,
  // et non directement comme dépendance de l'useEffect principal.
  const handleOpponentAttack = () => {
    if (
      !selectedFighter ||
      !opponent ||
      selectedFighter.currentHealth <= 0 ||
      opponent.currentHealth <= 0
    ) {
      return;
    }

    let attackType: "normal" | "special" = "normal";
    if (
      !opponentSpecialUsed &&
      opponent.currentHealth <= opponent.maxHealth * 0.5
    ) {
      attackType = "special";
      setOpponentSpecialUsed(true);
    }

    const attack = opponent.attack[attackType];
    let damageToDeal = attack.damage;
    let bonusDamage = 0;

    if (attackType === "normal") {
      bonusDamage = Math.floor(Math.random() * 3) + 1;
      damageToDeal += bonusDamage;
    }

    const newPlayerHealth = Math.max(
      selectedFighter.currentHealth - damageToDeal,
      0
    );
    setSelectedFighter({ ...selectedFighter, currentHealth: newPlayerHealth });

    let alertMessage = `${opponent.name} utilise ${attack.name} et inflige ${damageToDeal} dégâts !`;
    if (bonusDamage > 0) {
      alertMessage += ` (+${bonusDamage} dégâts bonus)`;
    }
    alert(alertMessage);

    if (newPlayerHealth === 0) {
      alert(`${selectedFighter.name} est vaincu !`);
    }
  };

  useEffect(() => {
    // Déplacez la définition de generateRandomOpponent à l'intérieur de useEffect
    // pour qu'elle ne soit pas recréée à chaque rendu du composant et ne cause pas de boucle infinie.
    const generateRandomOpponent = (playerFighter: Fighter) => {
      const possibleOpponents = fighters.filter(
        (opp) => opp.id !== playerFighter.id
      );

      if (possibleOpponents.length === 0) {
        console.warn(
          "Aucun autre combattant disponible pour être un adversaire."
        );
        setOpponent(null);
        return;
      }
      const randomOpponentData =
        possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];

      const newOpponent: Fighter = {
        ...randomOpponentData,
        currentHealth: randomOpponentData.maxHealth,
      };
      setOpponent(newOpponent);
      localStorage.setItem("opponentName", newOpponent.name);
      setOpponentSpecialUsed(false);
    };
    // Fin de la définition de generateRandomOpponent

    const storedFighterName = localStorage.getItem("selectedFighterName");

    const foundFighterData = storedFighterName
      ? fighters.find((f) => f.name === storedFighterName)
      : null;

    if (foundFighterData) {
      const newSelectedFighter: Fighter = {
        ...foundFighterData,
        currentHealth: foundFighterData.maxHealth,
      };
      setSelectedFighter(newSelectedFighter);

      const storedOpponentName = localStorage.getItem("opponentName");
      const storedOpponentData = storedOpponentName
        ? fighters.find((f) => f.name === storedOpponentName)
        : null;

      if (
        storedOpponentData &&
        storedOpponentData.id !== newSelectedFighter.id
      ) {
        const newOpponent: Fighter = {
          ...storedOpponentData,
          currentHealth: storedOpponentData.maxHealth,
        };
        setOpponent(newOpponent);
      } else {
        generateRandomOpponent(newSelectedFighter);
      }

      setPlayerSpecialUsed(false);
      setOpponentSpecialUsed(false);
    } else {
      router.push("/fighters");
    }
  }, [router]); // generateRandomOpponent n'est plus une dépendance car elle est définie à l'intérieur.

  useEffect(() => {
    if (selectedFighter) {
      console.log("Selected Fighter:", selectedFighter);
    }
    if (opponent) {
      console.log("Opponent Fighter:", opponent);
    }
  }, [selectedFighter, opponent]);

  const handleReplay = () => {
    // Note: generateRandomOpponent n'est plus accessible directement ici
    // car elle est définie dans useEffect. Vous devrez la rendre globale (avec useCallback)
    // ou la redéfinir ici, ou passer setSelectedFighter/setOpponent comme dépendances.
    // Pour l'instant, je vais la redéfinir localement ici pour que ça fonctionne.
    // OU, mieux, la rendre disponible via un autre moyen (par ex, la retourner depuis l'effet si nécessaire).

    // Pour l'instant, je vais copier la logique ici pour résoudre l'erreur immédiate.
    // Une meilleure structure serait de la sortir de useEffect avec useCallback,
    // mais si c'est interdit, on doit la dupliquer ou trouver une autre approche.
    // Considérant la contrainte, la dupliquer pour 'handleReplay' est la seule option simple.

    // Redéfinition locale ou logique directe pour handleReplay
    const generateRandomOpponentForReplay = (playerFighter: Fighter) => {
      const possibleOpponents = fighters.filter(
        (opp) => opp.id !== playerFighter.id
      );

      if (possibleOpponents.length === 0) {
        console.warn(
          "Aucun autre combattant disponible pour être un adversaire."
        );
        setOpponent(null);
        return;
      }
      const randomOpponentData =
        possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];

      const newOpponent: Fighter = {
        ...randomOpponentData,
        currentHealth: randomOpponentData.maxHealth,
      };
      setOpponent(newOpponent);
      localStorage.setItem("opponentName", newOpponent.name);
      setOpponentSpecialUsed(false);
    };

    if (selectedFighter) {
      setSelectedFighter({
        ...selectedFighter,
        currentHealth: selectedFighter.maxHealth,
      });
      setPlayerSpecialUsed(false);
      generateRandomOpponentForReplay(selectedFighter); // Appelle la version locale
    }
  };

  const handleBackToSelection = () => {
    localStorage.removeItem("selectedFighterName");
    localStorage.removeItem("opponentName");
    router.push("/fighters");
  };

  const handleAttack = (type: "normal" | "special") => {
    if (
      !selectedFighter ||
      !opponent ||
      opponent.currentHealth <= 0 ||
      selectedFighter.currentHealth <= 0
    ) {
      return;
    }

    if (type === "special") {
      if (
        playerSpecialUsed ||
        selectedFighter.currentHealth > selectedFighter.maxHealth * 0.5
      ) {
        alert(
          "L'attaque spéciale ne peut être utilisée qu'une fois et lorsque votre vie est inférieure à 50% !"
        );
        return;
      }
      setPlayerSpecialUsed(true);
    }

    const attack = selectedFighter.attack[type];
    let damageToDeal = attack.damage;
    let bonusDamage = 0;
    if (type === "normal") {
      bonusDamage = Math.floor(Math.random() * 3) + 1;
      damageToDeal += bonusDamage;
    }

    const newOpponentHealth = Math.max(
      opponent.currentHealth - damageToDeal,
      0
    );
    setOpponent({ ...opponent, currentHealth: newOpponentHealth });

    let alertMessage = `${selectedFighter.name} utilise ${attack.name} et inflige ${damageToDeal} dégâts !`;
    if (bonusDamage > 0) {
      alertMessage += ` (+${bonusDamage} dégâts bonus)`;
    }
    alert(alertMessage);

    if (newOpponentHealth === 0) {
      alert("Victoire !");
      return;
    }

    setTimeout(() => handleOpponentAttack(), 500);
  };

  return (
    <div>
      <h1>Arène de combats</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {selectedFighter && (
          <FighterCard
            fighter={selectedFighter}
            currentHealth={selectedFighter.currentHealth}
          />
        )}
        {opponent && (
          <FighterCard
            fighter={opponent}
            currentHealth={opponent.currentHealth}
          />
        )}
      </div>

      {selectedFighter && opponent && (
        <CombatButtons
          onAttack={handleAttack}
          onReplay={handleReplay}
          onBack={handleBackToSelection}
          playerHealth={selectedFighter.currentHealth}
          opponentHealth={opponent.currentHealth}
          playerSpecialUsed={playerSpecialUsed}
          initialPlayerHealth={selectedFighter.maxHealth}
        />
      )}
    </div>
  );
}
