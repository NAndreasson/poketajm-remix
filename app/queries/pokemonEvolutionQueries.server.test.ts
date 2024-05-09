import {
  getPokemonsWithoutPredecessors,
  getPokemonsWithoutSuccessors,
  getPredecessorPokemons,
  getSuccessors,
} from "./pokemonEvolutionQueries.server";
import { pokemonFactory, resetDB } from "~/test-utils";

describe("getPredecessorPokemons", () => {
  beforeEach(async () => {
    await resetDB();
  });

  test("returns predecessors to the given pokemon", async () => {
    const pokemon2 = await pokemonFactory.create({
      name: "Charizard",
      types: ["Fire"],
      weaknesses: ["Ground"],
    });
    const pokemon1 = await pokemonFactory.create({
      name: "Charmeleon",
      types: ["Fire"],
      weaknesses: ["Ground"],
      evolutionId: pokemon2.id,
    });
    await pokemonFactory.create({
      name: "Charmander",
      types: ["Fire"],
      weaknesses: ["Ground"],
      evolutionId: pokemon1.id,
    });

    const predecessors = await getPredecessorPokemons(pokemon2.id);
    expect(predecessors).toHaveLength(2);
    expect(predecessors[0].name).toBe("Charmeleon");
    expect(predecessors[1].name).toBe("Charmander");
  });
});

describe("getSuccessors", () => {
  beforeEach(async () => {
    await resetDB();
  });

  test("returns successors to the given pokemon", async () => {
    const pokemon2 = await pokemonFactory.create({
      name: "Charizard",
      types: ["Fire"],
      weaknesses: ["Ground"],
    });
    const pokemon1 = await pokemonFactory.create({
      name: "Charmeleon",
      types: ["Fire"],
      weaknesses: ["Ground"],
      evolutionId: pokemon2.id,
    });
    const pokemon0 = await pokemonFactory.create({
      name: "Charmander",
      types: ["Fire"],
      weaknesses: ["Ground"],
      evolutionId: pokemon1.id,
    });

    const successors = await getSuccessors(pokemon0.id);
    expect(successors).toHaveLength(2);
    expect(successors[0].name).toBe("Charmeleon");
    expect(successors[1].name).toBe("Charizard");
  });

  test("returns empty array if no successors", async () => {
    const pokemon2 = await pokemonFactory.create({
      name: "Charizard",
      types: ["Fire"],
      weaknesses: ["Ground"],
    });

    const successors = await getSuccessors(pokemon2.id);
    expect(successors).toHaveLength(0);
  });
});

describe("getPokemonsWithoutPredecessors", () => {
  beforeEach(async () => {
    await resetDB();
  });

  test("returns pokemons without predecessors", async () => {
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: ["Ground"],
      evolutionId: raichu.id,
    });

    const pokemons = await getPokemonsWithoutPredecessors();
    expect(pokemons).toHaveLength(1);
    expect(pokemons[0].name).toBe("Pikachu");
  });
});

describe("getPokemonsWithoutSuccessors", () => {
  beforeEach(async () => {
    await resetDB();
  });
  
  test("returns pokemons without successors", async () => {
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: ["Ground"],
      evolutionId: raichu.id,
    });

    const pokemons = await getPokemonsWithoutSuccessors();
    expect(pokemons).toHaveLength(1);
    expect(pokemons[0].name).toBe("Raichu");
  });
});
