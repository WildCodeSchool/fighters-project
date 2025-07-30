// app/combats/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

type Fight = {
  id: number;
  fighter1_name: string;
  fighter2_name: string;
  winner_name: string | null;
  date: string;
};

export default function CombatsPage() {
  const [combats, setCombats] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add("hide-global-scores-link");
    return () => {
      document.body.classList.remove("hide-global-scores-link");
    };
  }, []);

  useEffect(() => {
    fetch("/api/infos/combats")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Données reçues de l'API dans app/combats/page.tsx:", data);
        setCombats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du fetch des combats :", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className={styles.loadingMessage}>Chargement des combats...</p>;

  return (
    <div className={styles.combatPageContainer}>
      {" "}
      <h1 className={styles.pageTitle}>Historique des combats</h1>
      <div className={styles.backButtonContainer}>
        {" "}
        <Link href="/fighters" className={styles.backButton}>
          Retour aux combattants
        </Link>
      </div>
      {combats.length === 0 ? (
        <p className={styles.noCombatsMessage}>
          Aucun combat enregistré pour l’instant.
        </p>
      ) : (
        <ul className={styles.combatsList}>
          {combats.map((fight) => (
            <li key={fight.id} className={styles.combatItem}>
              <p>
                <strong>Combattants :</strong>{" "}
                <span className={styles.fighterName}>
                  {fight.fighter1_name}
                </span>{" "}
                vs{" "}
                <span className={styles.fighterName}>
                  {fight.fighter2_name}
                </span>
              </p>
              <p>
                <strong>Vainqueur :</strong>{" "}
                {fight.winner_name ? (
                  <span className={styles.winnerName}>{fight.winner_name}</span>
                ) : (
                  <span className={styles.noWinner}>
                    Aucun (égalité ou abandon)
                  </span>
                )}
              </p>
              <p className={styles.combatDate}>
                <strong>Date :</strong>{" "}
                {new Date(fight.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
