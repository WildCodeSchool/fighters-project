"use client";

import { useRouter } from "next/navigation";
import styles from "./FightersList.module.css";
import { fighters, Fighter } from "@/data/fighters";

export default function FighterList() {
  const router = useRouter();

  const handleSelect = (fighter: Fighter) => {
    localStorage.setItem("selectedFighter", JSON.stringify(fighter)); //Je stocke le fighter sélectionné dans le localStorage.
    // La méthode setItem() de l'interface Storage, lorsque lui sont passées le duo clé-valeur, les ajoute à l'emplacement de stockage.
    //La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON.
    // Je peux ensuite récupérer ce fighter dans un autre composant.
    // Je sais que tu va passer par là Benjamin :),
    // donc j'aimerais savoir si c'est la bonne méthode pour le stocker dans le localstorage afin de venir le récupérer ensuite dans une nouvelle page combat.
    // de mon coté tout fonctionne bien, le fighter sélectionner et bien dans le localStorage.
    // à voir si cela fonction pour l'importer dans la page combat.

    localStorage.removeItem("opponent"); // Je supprime l'adversaire précédent du localStorage pour éviter les conflits.

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
          <p>Health : {fighter.health}</p>
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
