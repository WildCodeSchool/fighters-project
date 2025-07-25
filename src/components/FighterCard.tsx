import { Fighter } from "@/model/Fighter";
import styles from "./FighterCard.module.css";

type FighterCardProps = {
  fighter: Fighter;
  currentHealth: number;
  isPlayer: boolean;
};

export default function FighterCard({
  fighter,
  currentHealth,
  isPlayer,
}: FighterCardProps) {
  const healthPercentage = (currentHealth / fighter.maxHealth) * 100;
  const imageClasses = `${styles.fighterImage} ${
    !isPlayer ? styles.flippedImage : ""
  }`;

  return (
    <div className={styles.fighterCard}>
      <p className={styles.name}>{fighter.name}</p>
      <img src={fighter.image} alt={fighter.name} className={imageClasses} />
      <p>
        PV : {currentHealth} / {fighter.maxHealth}
      </p>
      <div className={styles.healthBarContainer}>
        <div
          className={styles.healthBar}
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
