type TypeId = number;

export interface Pokemon {
  name: string;
  img: string;
  height: string;
  weight: string;
  num: string;
  candy: string;
  types: TypeId[];
  weaknesses: TypeId[];
  evolutionId?: number;
}

export interface PersistedPokemon extends Pokemon {
  id: number;
}