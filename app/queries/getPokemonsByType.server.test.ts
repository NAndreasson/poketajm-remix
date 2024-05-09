import { prisma } from "~/db.server";
import { getPokemonsByType } from "./getPokemonsByType.server";
import { pokemonFactory, resetDB } from "~/test-utils";


describe("getPokemonsByType", () => {

  beforeEach(async () => {
    await resetDB();
  })

  test("returns pokemons with the specified type and default sort name in ascending order", async () => {
    const pokemon1 = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });
    await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    await pokemonFactory.create({
      name: "Groundchu",
      types: ["Ground"],
      weaknesses: ["Electric"],
    });

    const electricType = await prisma.type.findFirst({
      where: { name: "Electric" },
    });

    const electricTypeWithPokemons = await getPokemonsByType(electricType.id);

    expect(electricTypeWithPokemons.pokemons).toHaveLength(2);
    expect(electricTypeWithPokemons.pokemons[0].pokemon.name).toBe("Pikachu");
    expect(electricTypeWithPokemons.pokemons[1].pokemon.name).toBe("Raichu");
  });

  test("returns pokemons with specified type and ordering", async () => {
    await pokemonFactory.create({
      name: "Pikachu",
      height: "140 cm",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    await pokemonFactory.create({
      name: "Raichu",
      height: "180 cm",
      types: ["Electric"],
      weaknesses: ["Ground"],
    });

    const electricType = await prisma.type.findFirst({
      where: { name: "Electric" },
    });

    expect(electricType).toBeTruthy();

    const electricTypeWithPokemons = await getPokemonsByType(electricType.id, {
      sort: { param: "height", order: "desc" },
    });

    expect(electricTypeWithPokemons.pokemons).toHaveLength(2);
    expect(electricTypeWithPokemons.pokemons[0].pokemon.name).toBe("Raichu");
    expect(electricTypeWithPokemons.pokemons[1].pokemon.name).toBe("Pikachu");
  });
});

