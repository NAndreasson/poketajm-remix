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
      name: "Charizard",
    });

    const pokemons = await searchPokemons("chu");
    expect(pokemons).toHaveLength(2);

    const pokemonNames = pokemons.map((pokemon) => pokemon.name);
    expect(pokemonNames).toContain("Raichu");
    expect(pokemonNames).toContain("Pikachu");
  });
});
