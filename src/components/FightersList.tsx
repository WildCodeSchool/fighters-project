"use client";
import styles from "./FightersList.module.css";

type Fighter = {
  id: number;
  name: string;
  health: number;
  style: string;
  image: string;
};

const fighters: Fighter[] = [
  {
    id: 1,
    name: "Ken",
    health: 100,
    style: "Karate",
    image: "/fighters/Ken_Masters_(SF3_-_Third_Strike).png",
  },
  {
    id: 2,
    name: "Chun-Li",
    health: 90,
    style: "Taekwondo",
    image: "/fighters/Chun-Li.png",
  },
  {
    id: 3,
    name: "Ryu",
    health: 100,
    style: "Judo",
    image: "/fighters/RyuStreetFighterTwoHadoken.png",
  },
];

export default function FighterList() {
  const handleSelect = (fighter: Fighter) => {
    localStorage.setItem("selectedFighter", JSON.stringify(fighter)); //Je stocke le fighter sélectionné dans le localStorage.
    // La méthode setItem() de l'interface Storage, lorsque lui sont passées le duo clé-valeur, les ajoute à l'emplacement de stockage.
    // Je peux ensuite récupérer ce fighter dans un autre composant.
    //La méthode JSON.stringify() convertit une valeur JavaScript en chaîne JSON.
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
