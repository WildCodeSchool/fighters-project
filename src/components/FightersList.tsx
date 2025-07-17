"use client";

import { useRouter } from "next/navigation";
import styles from "./FightersList.module.css";
import { fighters } from "@/data/fighters";
import { Fighter } from "@/model/Fighter";

export default function FighterList() {
  const router = useRouter();

  const handleSelect = (fighter: Fighter) => {
    localStorage.setItem("selectedFighterName", fighter.name);

    localStorage.removeItem("opponentName");

    router.push("/arena");
    alert(`${fighter.name} a été sélectionné!`);
  };

  return (
    <ul className={styles.containerCard}>
      {fighters.map((fighter) => (
        <li key={fighter.id} className={styles.fighterCard}>
          <p className={styles.fighterName}>{fighter.name}</p>
          <img
            className={styles.fighterImage}
            src={fighter.image}
            alt={fighter.name}
          />
          <p>Style : {fighter.style}</p>
          <p>Health : {fighter.maxHealth}</p>
          <button
            className={styles.fighterButton}
            onClick={() => handleSelect(fighter)}
          >
            Choisir ce fighter
          </button>
        </li>
      ))}
    </ul>
  );
}
