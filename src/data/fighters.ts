export type Fighter = {
  id: number;
  name: string;
  health: number;
  style: string;
  image: string;
  attack: {
    normal: {
      damage: number;
      name: string;
    };
    special: {
      damage: number;
      name: string;
    };
  };
};

export const fighters: Fighter[] = [
  {
    id: 1,
    name: "Ken",
    health: 100,
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
    id: 2,
    name: "Chun-Li",
    health: 90,
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
    id: 3,
    name: "Ryu",
    health: 100,
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
