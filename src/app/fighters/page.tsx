"use client";

import FighterList from "@/components/FightersList";
import styles from "./page.module.css";

export default function FightersPage() {
  return (
    <div>
      <h1 className={styles.listTitle}>Liste des Fighters</h1>
      <FighterList />
    </div>
  );
}
