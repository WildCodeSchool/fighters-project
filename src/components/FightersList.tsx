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
        </li>
      ))}
    </ul>
  );
}
