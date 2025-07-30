"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Fighter } from "@/model/Fighter";
import { fighters } from "@/data/fighters";
import FighterCard from "@/components/FighterCard";
import CombatButtons from "@/components/CombatButtons";

import { generateRandomOpponent } from "@/lib/combat/generateRandomOpponent";
import { handlePlayerAttack } from "@/lib/combat/handlePlayerAttack";
import { executeOpponentAttack } from "@/lib/combat/executeOpponentAttack";
import { resetFight } from "@/lib/combat/resetFight";

import styles from "./page.module.css";

export default function ArenaPage() {
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [opponent, setOpponent] = useState<Fighter | null>(null);
  const [playerSpecialUsed, setPlayerSpecialUsed] = useState(false);
  const [opponentSpecialUsed, setOpponentSpecialUsed] = useState(false);
  const [combatFinished, setCombatFinished] = useState(false);

  const recordCombatResult = useCallback(
    async (fighter1Id: number, fighter2Id: number, winnerId: number | null) => {
      try {
        const res = await fetch("/api/infos/combats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fighter1_id: fighter1Id,
            fighter2_id: fighter2Id,
            winner_id: winnerId,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(
            "Erreur détaillée lors de l'enregistrement du combat:",
            errorData
          );
          throw new Error(
            `Erreur lors de l'enregistrement du combat: ${res.status} - ${
              errorData.error || res.statusText
            }`
          );
        }
        console.log("Combat enregistré avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du combat :", error);
      }
    },
    []
  );

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

  const onPlayerVictory = useCallback(() => {
    if (selectedFighter && opponent) {
      alert(`${selectedFighter.name} a vaincu ${opponent.name} !`);
      setCombatFinished(true);
      recordCombatResult(selectedFighter.id, opponent.id, selectedFighter.id);
    }
  }, [selectedFighter, opponent, recordCombatResult]);

  const onOpponentVictory = useCallback(() => {
    if (selectedFighter && opponent) {
      alert(`${opponent.name} a vaincu ${selectedFighter.name} !`);
      setCombatFinished(true);
      recordCombatResult(selectedFighter.id, opponent.id, opponent.id);
    }
  }, [selectedFighter, opponent, recordCombatResult]);

  const handleAttack = useCallback(
    (attackType: "normal" | "special") => {
      if (!selectedFighter || !opponent || combatFinished) return;

      handlePlayerAttack({
        selectedFighter,
        opponent,
        attackType,
        playerSpecialUsed,
        setOpponent,
        setPlayerSpecialUsed,
        setSelectedFighter,
        onVictory: onPlayerVictory,
        onOpponentTurn: () => {
          setTimeout(() => {
            if (
              opponent.currentHealth > 0 &&
              selectedFighter.currentHealth > 0
            ) {
              executeOpponentAttack({
                attacker: opponent,
                defender: selectedFighter,
                specialUsed: opponentSpecialUsed,
                setDefender: setSelectedFighter,
                setSpecialUsed: setOpponentSpecialUsed,
                onDefeat: onOpponentVictory,
              });
            }
          }, 800);
        },
      });
    },
    [
      selectedFighter,
      opponent,
      playerSpecialUsed,
      opponentSpecialUsed,
      combatFinished,
      onPlayerVictory,
      onOpponentVictory,
      setSelectedFighter,
    ]
  );

  const handleReplay = useCallback(() => {
    if (!selectedFighter) return;
    setCombatFinished(false);
    resetFight({
      selectedFighter,
      setSelectedFighter,
      setOpponent,
      setPlayerSpecialUsed,
      setOpponentSpecialUsed,
    });
    const newOpponent = generateRandomOpponent(selectedFighter);
    if (newOpponent) {
      setOpponent({ ...newOpponent, currentHealth: newOpponent.maxHealth });
      localStorage.setItem("opponentName", newOpponent.name);
    } else {
      console.warn("Impossible de générer un nouvel adversaire.");
      router.push("/fighters");
    }
  }, [selectedFighter, router]);

  const handleBackToSelection = useCallback(() => {
    localStorage.removeItem("selectedFighterName");
    localStorage.removeItem("opponentName");
    router.push("/fighters");
  }, [router]);

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
