import { Fighter } from "@/model/Fighter";

type FighterCardProps = {
  fighter: Fighter;
  currentHealth: number;
};

export default function FighterCard({
  fighter,
  currentHealth,
}: FighterCardProps) {
  return (
    <div>
      <p>Nom : {fighter.name}</p>
      <p>Style : {fighter.style}</p>
      <p>
        {fighter.name} – PV : {currentHealth}
      </p>
      <img src={fighter.image} alt={fighter.name} />
    </div>
  );
}
