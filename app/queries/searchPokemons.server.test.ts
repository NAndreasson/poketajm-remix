import { pokemonFactory, resetDB } from "~/test-utils";
import { searchPokemons } from "./searchPokemons.server";

describe("searchokemons", () => {
  beforeEach(async () => {
    await resetDB();
  });

  test("returns pokemons that match the search query", async () => {
    await pokemonFactory.create({
      name: "Raichu",
    });
    await pokemonFactory.create({
      name: "Pikachu",
    });

    await pokemonFactory.create({
      name: "Duckle",
    });

    const pokemons = await searchPokemons("pchu");
    expect(pokemons).toHaveLength(2);

    const pokemonNames = pokemons.map((pokemon) => pokemon.name);
    expect(pokemonNames[0]).toEqual("Pikachu");
    expect(pokemonNames[1]).toEqual("Raichu");
  });
});
