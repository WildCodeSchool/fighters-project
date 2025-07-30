import { Fighter } from "@/model/Fighter";
export const fighters: Fighter[] = [
  {
    id: 2,
    name: "Ken",
    maxHealth: 100,
    currentHealth: 100,
    style: "Karate",
    image: "/fighters/Ken_Masters_(SF3_-_Third_Strike).png",
    attack: {
      normal: {
        damage: 9,
        name: "Coup de poing rapide",
      },
      special: {
        damage: 25,
        name: "Shoryuken",
      },
    },
  },
  {
    id: 3,
    name: "Chun-Li",
    maxHealth: 90,
    currentHealth: 90,
    style: "Taekwondo",
    image: "/fighters/Chun-Li.png",
    attack: {
      normal: {
        damage: 10,
        name: "Coup de pied sauté",
      },
      special: {
        damage: 20,
        name: "Lightning Kick",
      },
    },
  },
  {
    id: 1,
    name: "Ryu",
    maxHealth: 100,
    currentHealth: 100,
    style: "Judo",
    image: "/fighters/RyuStreetFighterTwoHadoken.png",
    attack: {
      normal: {
        damage: 9,
        name: "Projection de judo",
      },
      special: {
        damage: 30,
        name: "Hadoken",
      },
    },
  },
];
