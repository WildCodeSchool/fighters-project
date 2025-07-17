export type Fighter = {
  id: number;
  name: string;
  maxHealth: number;
  currentHealth: number;
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
