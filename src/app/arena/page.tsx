"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react"; // useRef est utilisé pour garder une référence mutable à un objet afin de ne pas perdre la valeur actuelle des états lors des appels asynchrones
import { fighters, Fighter } from "@/data/fighters";
import FighterCard from "@/components/FighterCard";
import CombatButtons from "@/components/CombatButtons";

export default function ArenaPage() {
  // Utilisation du hook useRouter pour la navigation
  const router = useRouter();
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [initialPlayerHealth, setInitialPlayerHealth] = useState<number>(100); // Initialisation de la vie du joueur à 100, elle est utile pour vérifier si l'attaque spéciale peut être utilisée
  const [opponent, setOpponent] = useState<Fighter | null>(null);
  const [initialOpponentHealth, setInitialOpponentHealth] =
    useState<number>(100);
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [opponentHealth, setOpponentHealth] = useState<number>(100);

  const [playerSpecialUsed, setPlayerSpecialUsed] = useState<boolean>(false);
  const [opponentSpecialUsed, setOpponentSpecialUsed] =
    useState<boolean>(false);

  // Les useRef permets d'accéder aux valeurs les plus récentes des états des combattants (vie du joueur, adversaire), surtout pour les fonctions asynchrones (comme setTimeout)
  const selectedFighterRef = useRef(selectedFighter);
  const opponentRef = useRef(opponent);
  const playerHealthRef = useRef(playerHealth);
  const opponentHealthRef = useRef(opponentHealth);
  const initialPlayerHealthRef = useRef(initialPlayerHealth);
  const initialOpponentHealthRef = useRef(initialOpponentHealth);

  // Met à jour les références à chaque changement des états correspondants
  useEffect(() => {
    selectedFighterRef.current = selectedFighter; //.current permets d'accéder à la valeur actuelle de la référence en allant chercher dans l'objet selectedFighterRef
    opponentRef.current = opponent;
    playerHealthRef.current = playerHealth;
    opponentHealthRef.current = opponentHealth;
    initialPlayerHealthRef.current = initialPlayerHealth;
    initialOpponentHealthRef.current = initialOpponentHealth;
  }, [
    // le tableau de dépendances permet de déclencher l'effet à chaque fois que l'un des états change
    selectedFighter,
    opponent,
    playerHealth,
    opponentHealth,
    initialPlayerHealth,
    initialOpponentHealth,
  ]);
  // generateRandomOpponent est une fonction qui génère un adversaire aléatoire, sauf le combattant sélectionné
  const generateRandomOpponent = (fighter: Fighter) => {
    const possibleOpponents = fighters.filter(
      (opponent) => opponent.id !== fighter.id
    );
    const randomOpponent =
      possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
    setOpponent(randomOpponent);
    setOpponentHealth(randomOpponent.health);
    setInitialOpponentHealth(randomOpponent.health);
    localStorage.setItem("opponent", JSON.stringify(randomOpponent));
    setOpponentSpecialUsed(false); // Réinitialise l'état de l'attaque spéciale de l'adversaire
    localStorage.setItem("opponentSpecialUsed", "false");
  };

  // Chargement initial du combattant et de l'adversaire depuis le localStorage
  useEffect(() => {
    const storedFighter = localStorage.getItem("selectedFighter");
    const storedOpponent = localStorage.getItem("opponent");
    const storedPlayerSpecialUsed = localStorage.getItem("playerSpecialUsed");
    const storedOpponentSpecialUsed = localStorage.getItem(
      "opponentSpecialUsed"
    );

    if (storedFighter) {
      const fighter = JSON.parse(storedFighter) as Fighter; // On parse le JSON pour obtenir l'objet Fighter
      setSelectedFighter(fighter);
      setPlayerHealth(fighter.health);
      setInitialPlayerHealth(fighter.health);

      if (storedOpponent) {
        const opponentFighter = JSON.parse(storedOpponent) as Fighter;
        setOpponent(opponentFighter);
        setOpponentHealth(opponentFighter.health);
        setInitialOpponentHealth(opponentFighter.health);
      } else {
        generateRandomOpponent(fighter); // generateRandomOpponent est appelé pour générer un adversaire aléatoire si aucun n'est stocké
      }

      setPlayerSpecialUsed(storedPlayerSpecialUsed === "true"); // Vérifie si l'attaque spéciale du joueur a été utilisée
      setOpponentSpecialUsed(storedOpponentSpecialUsed === "true");
    } else {
      router.push("/fighters"); // Si aucun combattant n'est sélectionné, rediriger vers la page de sélection
    }
  }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une fois au montage et permets d'optimiser les performances et de controller quand le useEffect s'exécute

  const handleReplay = () => {
    // Fonction pour rejouer le combat
    if (selectedFighter) {
      setPlayerHealth(initialPlayerHealth); // Réinitialise la vie du joueur à sa vie initiale
      setPlayerSpecialUsed(false);
      localStorage.setItem("playerSpecialUsed", "false");
      generateRandomOpponent(selectedFighter);
    }
  };

  const handleBackToSelection = () => {
    // Nettoie le localStorage avant de rediriger
    localStorage.removeItem("selectedFighter");
    localStorage.removeItem("opponent");
    localStorage.removeItem("playerSpecialUsed");
    localStorage.removeItem("opponentSpecialUsed");
    router.push("/fighters");
  };

  const handleAttack = (type: "normal" | "special") => {
    // Utilisation des références pour obtenir les valeurs actuelles
    const currentSelectedFighter = selectedFighterRef.current;
    const currentOpponent = opponentRef.current;
    let currentPlayerHealth = playerHealthRef.current;
    let currentOpponentHealth = opponentHealthRef.current;
    let currentInitialPlayerHealth = initialPlayerHealth;

    if (
      // Vérifications avant d'attaquer que le jeu n'a pas encore commencé ou que l'un des combattants est déjà vaincu
      !currentSelectedFighter ||
      !currentOpponent ||
      currentOpponentHealth <= 0 ||
      currentPlayerHealth <= 0
    ) {
      return;
    }

    if (type === "special") {
      // Conditions pour l'attaque spéciale du joueur
      if (
        playerSpecialUsed ||
        currentPlayerHealth > initialPlayerHealth * 0.5
      ) {
        alert(
          "L'attaque spéciale ne peut être utilisée qu'une fois et lorsque votre vie est inférieure à 50% !"
        );
        return;
      }
      setPlayerSpecialUsed(true); // Met à jour l'état de l'attaque spéciale du joueur
      localStorage.setItem("playerSpecialUsed", "true");
    }

    const attack = currentSelectedFighter.attack[type];
    let damageToDeal = attack.damage;
    let bonusDamage = 0;
    if (type === "normal") {
      bonusDamage = Math.floor(Math.random() * 3) + 1;
      damageToDeal += bonusDamage;
    }

    const newOpponentHealth = Math.max(currentOpponentHealth - damageToDeal, 0);

    setOpponentHealth(newOpponentHealth); // setOpponentHealth est utilisé pour mettre à jour la vie de l'adversaire
    const updatedOpponent = { ...currentOpponent, health: newOpponentHealth };
    setOpponent(updatedOpponent);
    localStorage.setItem("opponent", JSON.stringify(updatedOpponent));

    let alertMessage = `${currentSelectedFighter.name} utilise ${attack.name} et inflige ${damageToDeal} dégâts !`;
    if (bonusDamage > 0) {
      alertMessage += ` (+${bonusDamage} dégâts bonus)`;
    }
    alert(alertMessage);

    if (newOpponentHealth === 0) {
      alert("Victoire !");
      return;
    }

    setTimeout(() => handleOpponentAttack(), 1000); // L'adversaire attaque après un délai de 1 seconde
  };

  const handleOpponentAttack = () => {
    // Fonction pour gérer l'attaque de l'adversaire
    const currentSelectedFighter = selectedFighterRef.current;
    const currentOpponent = opponentRef.current;
    let currentPlayerHealth = playerHealthRef.current;
    let currentOpponentHealth = opponentHealthRef.current;
    let currentInitialOpponentHealth = initialOpponentHealthRef.current;

    if (
      !currentSelectedFighter ||
      !currentOpponent ||
      currentPlayerHealth <= 0 ||
      currentOpponentHealth <= 0
    ) {
      return;
    }

    let attackType: "normal" | "special" = "normal";
    if (
      !opponentSpecialUsed &&
      currentOpponentHealth <= currentInitialOpponentHealth * 0.5
    ) {
      attackType = "special";
      setOpponentSpecialUsed(true);
      localStorage.setItem("opponentSpecialUsed", "true");
    } else {
      attackType = "normal";
    }

    const attack = currentOpponent.attack[attackType];
    let damageToDeal = attack.damage;
    let bonusDamage = 0;

    if (attackType === "normal") {
      bonusDamage = Math.floor(Math.random() * 3) + 1;
      damageToDeal += bonusDamage;
    }

    const newPlayerHealth = Math.max(currentPlayerHealth - damageToDeal, 0);

    setPlayerHealth(newPlayerHealth);
    const updatedSelectedFighter = {
      ...currentSelectedFighter,
      health: newPlayerHealth,
    };
    setSelectedFighter(updatedSelectedFighter);
    localStorage.setItem(
      "selectedFighter",
      JSON.stringify(updatedSelectedFighter)
    );

    let alertMessage = `${currentOpponent.name} utilise ${attack.name} et inflige ${damageToDeal} dégâts !`;
    if (bonusDamage > 0) {
      alertMessage += ` (+${bonusDamage} dégâts bonus)`;
    }
    alert(alertMessage);

    if (newPlayerHealth === 0) {
      alert(`${currentSelectedFighter.name} est vaincu !`);
    }
  };

  return (
    <div>
      <h1>Arène de combats</h1>
      <div>
        {selectedFighter && ( //&& est utilisé pour vérifier si selectedFighter n'est pas null avant de rendre le composant FighterCard (moyen plus simple de remplacer un if)
          <FighterCard fighter={selectedFighter} currentHealth={playerHealth} />
        )}
        {opponent && (
          <FighterCard fighter={opponent} currentHealth={opponentHealth} />
        )}

        <CombatButtons
          onAttack={handleAttack}
          onReplay={handleReplay}
          onBack={handleBackToSelection}
          playerHealth={playerHealth}
          opponentHealth={opponentHealth}
          playerSpecialUsed={playerSpecialUsed}
          initialPlayerHealth={initialPlayerHealth}
        />
      </div>
    </div>
  );
}
