import { pokemonFactory, resetDB } from "~/test-utils";
import { findAntagonisticPokemons } from "./findAntagonisticPokemons.server";

beforeEach(async () => {
  await resetDB()
});

describe("findAntagonisticPokemons", () => {
  test("does not return a pokemon that is weak against the given pokemon", async () => {
    const pokemon1 = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    await pokemonFactory.create({
      name: "Groundchu",
      types: ["Ground"],
      weaknesses: ["Electric"],
    });

    const weakPokemons = await findAntagonisticPokemons(pokemon1.id);
    expect(weakPokemons).toHaveLength(0);
  });

  test("does not return a pokemon that is weak against the given pokemon", async () => {
    const pokemon1 = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: [],
    });

    await pokemonFactory.create({
      name: "Groundchu",
      types: ["Ground"],
      weaknesses: [],
    });

    const weakPokemons = await findAntagonisticPokemons(pokemon1.id);
    expect(weakPokemons).toHaveLength(0);
  });

  test("returns a pokemon that is weak against the given pokemon", async () => {
    const pokemon1 = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    const pokemon2 = await pokemonFactory.create({
      name: "Groundchu",
      types: ["Ground"],
      weaknesses: [],
    });

    const weakPokemons = await findAntagonisticPokemons(pokemon1.id);

    expect(weakPokemons).toHaveLength(1);
    expect(weakPokemons[0].name).toBe("Groundchu");
  });
});