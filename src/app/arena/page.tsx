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
import { saveCombat } from "@/lib/combat/saveCombat";

import styles from "./page.module.css";

export default function ArenaPage() {
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [opponent, setOpponent] = useState<Fighter | null>(null);
  const [playerSpecialUsed, setPlayerSpecialUsed] = useState(false);
  const [opponentSpecialUsed, setOpponentSpecialUsed] = useState(false);
  const [combatFinished, setCombatFinished] = useState(false);

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
    let initialOpponent: Fighter | null = null;
    if (storedOpponentName) {
      initialOpponent =
        fighters.find(
          (f) => f.name === storedOpponentName && f.id !== newSelectedFighter.id
        ) || null;
    }
    if (!initialOpponent) {
      initialOpponent = generateRandomOpponent(newSelectedFighter);
      if (initialOpponent) {
        localStorage.setItem("opponentName", initialOpponent.name);
      }
    }

    if (initialOpponent) {
      setOpponent({
        ...initialOpponent,
        currentHealth: initialOpponent.maxHealth,
      });
    } else {
      console.warn("Impossible de générer un adversaire. Redirection.");
      router.push("/fighters");
    }
    setCombatFinished(false);
  }, [router]);

  useEffect(() => {
    if (opponent && opponent.currentHealth === 0 && selectedFighter) {
      alert(`${selectedFighter.name} a vaincu ${opponent.name} !`);
      setCombatFinished(true);
      saveCombat(selectedFighter, opponent, selectedFighter.id);
    }
  }, [opponent, selectedFighter]);

  useEffect(() => {
    if (selectedFighter && selectedFighter.currentHealth === 0 && opponent) {
      alert(`${opponent.name} a vaincu ${selectedFighter.name} !`);
      setCombatFinished(true);
      saveCombat(selectedFighter, opponent, opponent.id);
    }
  }, [selectedFighter, opponent]);

  const handleAttack = (attackType: "normal" | "special") => {
    if (!selectedFighter || !opponent || combatFinished) return;

    handlePlayerAttack({
      selectedFighter,
      opponent,
      attackType,
      playerSpecialUsed,
      setOpponent,
      setPlayerSpecialUsed,
      setSelectedFighter,
      onVictory: () => {},
      onOpponentTurn: () => {
        setTimeout(() => {
          setOpponent((prevOpponent) => {
            setSelectedFighter((prevSelectedFighter) => {
              if (
                prevOpponent &&
                prevOpponent.currentHealth > 0 &&
                prevSelectedFighter &&
                prevSelectedFighter.currentHealth > 0
              ) {
                executeOpponentAttack({
                  attacker: prevOpponent,
                  defender: prevSelectedFighter,
                  specialUsed: opponentSpecialUsed,
                  setDefender: setSelectedFighter,
                  setSpecialUsed: setOpponentSpecialUsed,
                  onDefeat: () => {},
                });
              }
              return prevSelectedFighter;
            });
            return prevOpponent;
          });
        }, 800);
      },
    });
  };

  const handleReplay = () => {
    if (!selectedFighter) return;
    setCombatFinished(false);
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
    <div className={styles.container}>
      <h1 className={styles.title}>Arène de combats</h1>

      <div className={styles.fightersDisplay}>
        {selectedFighter && (
          <FighterCard
            fighter={selectedFighter}
            currentHealth={selectedFighter.currentHealth}
            isPlayer={true}
          />
        )}
        {opponent && (
          <FighterCard
            fighter={opponent}
            currentHealth={opponent.currentHealth}
            isPlayer={false}
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
          disableButtons={combatFinished}
        />
      )}
    </div>
  );
}
