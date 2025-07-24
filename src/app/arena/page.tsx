"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Fighter } from "@/model/Fighter";
import { fighters } from "@/data/fighters";
import FighterCard from "@/components/FighterCard";
import CombatButtons from "@/components/CombatButtons";

import { generateRandomOpponent } from "@/lib/combat/generateRandomOpponent";
import { handlePlayerAttack } from "@/lib/combat/handlePlayerAttack";
import { executeOpponentAttack } from "@/lib/combat/executeOpponentAttack";
import { resetFight } from "@/lib/combat/resetFight";

export default function ArenaPage() {
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [opponent, setOpponent] = useState<Fighter | null>(null);
  const [playerSpecialUsed, setPlayerSpecialUsed] = useState(false);
  const [opponentSpecialUsed, setOpponentSpecialUsed] = useState(false);

  useEffect(() => {
    const storedFighterName = localStorage.getItem("selectedFighterName");

    const foundFighter = fighters.find((f) => f.name === storedFighterName);

    if (!foundFighter) {
      router.push("/fighters");
      return;
    }

    const newSelectedFighter = {
      ...foundFighter,
      currentHealth: foundFighter.maxHealth,
    };
    setSelectedFighter(newSelectedFighter);

    const storedOpponentName = localStorage.getItem("opponentName");
    const foundOpponent = fighters.find((f) => f.name === storedOpponentName);

    if (foundOpponent && foundOpponent.id !== newSelectedFighter.id) {
      setOpponent({ ...foundOpponent, currentHealth: foundOpponent.maxHealth });
    } else {
      const newOpponent = generateRandomOpponent(newSelectedFighter);
      if (newOpponent) {
        setOpponent(newOpponent);
        localStorage.setItem("opponentName", newOpponent.name);
      }
    }

    setPlayerSpecialUsed(false);
    setOpponentSpecialUsed(false);
  }, [router]);

  const handleAttack = (type: "normal" | "special") => {
    if (!selectedFighter || !opponent) return;

    handlePlayerAttack({
      selectedFighter,
      opponent,
      attackType: type,
      playerSpecialUsed,
      setSelectedFighter,
      setOpponent,
      setPlayerSpecialUsed,
      onVictory: () => alert("Victoire !"),
      onOpponentTurn: () => {
        executeOpponentAttack({
          attacker: opponent,
          defender: selectedFighter,
          specialUsed: opponentSpecialUsed,
          setDefender: setSelectedFighter,
          setSpecialUsed: setOpponentSpecialUsed,
          onDefeat: () => alert(`${selectedFighter.name} est vaincu !`),
        });
      },
    });
  };

  const handleReplay = () => {
    if (!selectedFighter) return;

    resetFight({
      selectedFighter,
      setSelectedFighter,
      setOpponent,
      setPlayerSpecialUsed,
      setOpponentSpecialUsed,
    });
  };

  const handleBackToSelection = () => {
    localStorage.removeItem("selectedFighterName");
    localStorage.removeItem("opponentName");
    router.push("/fighters");
  };

  return (
    <div>
      <h1>Arène de combats</h1>

      <div>
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
