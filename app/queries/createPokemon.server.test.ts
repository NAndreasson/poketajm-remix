import { pokemonFactory, resetDB, typeFactory } from "~/test-utils";
import { createPokemon } from "./createPokemon.server";
import { getPredecessorPokemons, getSuccessors } from "./pokemonEvolutionQueries.server";

describe("createPokemon", () => {
  beforeEach(async () => {
    await resetDB();
  });

  test("creates a pokemon with the given data", async () => {
    const electricType = await typeFactory.create({ name: "Electric" });
    const groundType = await typeFactory.create({ name: "Ground" });

    const pokemon = await createPokemon({
      name: "Pikachu",
      img: "...",
      height: "140 cm",
      weight: "40 kg",
      num: "25",
      candy: "Pikachu Candy",
      types: [electricType.id],
      weaknesses: [groundType.id],
    });

    expect(pokemon.name).toBe("Pikachu");
    expect(pokemon.img).toBe("...");
    expect(pokemon.height).toBe("140 cm");
    expect(pokemon.weight).toBe("40 kg");
    expect(pokemon.num).toBe("25");
    expect(pokemon.candy).toBe("Pikachu Candy");
    expect(pokemon.types).toHaveLength(1);
    expect(pokemon.types[0].type.name).toBe("Electric");
    expect(pokemon.weaknesses).toHaveLength(1);
    expect(pokemon.weaknesses[0].type.name).toBe("Ground");
  });

  test("can provide evolution predecessor and successor", async () => {
    const electricType = await typeFactory.create({ name: "Electric" });
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
    });
    const pikachu = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
    });

    const rikachu = await createPokemon({
      name: "Rikachu",
      img: "...",
      height: "140 cm",
      weight: "40 kg",
      num: "25",
      candy: "Pikachu Candy",
      types: [electricType.id],
      weaknesses: [],
      evolutionId: raichu.id,
      predecessorId: pikachu.id,
    });

    const successorsToRikachu = await getSuccessors(rikachu.id);

    expect(successorsToRikachu).toHaveLength(1);
    expect(successorsToRikachu[0].name).toBe("Raichu");

    const predecessorsToRaichu = await getPredecessorPokemons(rikachu.id);

    expect(predecessorsToRaichu).toHaveLength(1);
    expect(predecessorsToRaichu[0].name).toBe("Pikachu");
  });

  test.only("throws an error if the predecessor already has an evolution", async () => {
    const electricType = await typeFactory.create({ name: "Electric" });
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
    });
    const pikachu = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      evolutionId: raichu.id,
    });

    try {
      const rikachu = await createPokemon({
        name: "Rikachu",
        img: "...",
        height: "140 cm",
        weight: "40 kg",
        num: "25",
        candy: "Pikachu Candy",
        types: [electricType.id],
        weaknesses: [],
        predecessorId: pikachu.id,
      });
      // Should never run
      expect(rikachu).toBeUndefined();
    } catch (error) {
      console.log("Error", error)
      expect(error.message).toBe("Predecessor already has a successor");
    }
  });

  test("throws an error if the successor already has a predecessor", async () => {
    const electricType = await typeFactory.create({ name: "Electric" });
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
    });
    const pikachu = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      evolutionId: raichu.id,
    });

    try {
      const rikachu = await createPokemon({
        name: "Rikachu",
        img: "...",
        height: "140 cm",
        weight: "40 kg",
        num: "25",
        candy: "Pikachu Candy",
        types: [electricType.id],
        weaknesses: [],
        evolutionId: raichu.id,
      });
      // Should never run
      expect(rikachu).toBeUndefined();
    } catch (error) {
      console.log("Error", error)
      expect(error.message).toBe("Evolution already has a predecessor");
    }
  });

  test("prevents evolutionary loops", async () => {
    const electricType = await typeFactory.create({ name: "Electric" });
    const raichu = await pokemonFactory.create({
      name: "Raichu",
      types: ["Electric"],
    });
    const pikachu = await pokemonFactory.create({
      name: "Pikachu",
      types: ["Electric"],
      evolutionId: raichu.id,
    });

    try {
      // This would create a loop Pikachu -> Raichu -> Rikachu -> Pikachu
      const rikachu = await createPokemon({
        name: "Rikachu",
        img: "...",
        height: "140 cm",
        weight: "40 kg",
        num: "25",
        candy: "Pikachu Candy",
        types: [electricType.id],
        weaknesses: [],
        evolutionId: pikachu.id,
        predecessorId: raichu.id,
      });
      // Should never run
      expect(rikachu).toBeUndefined();
    } catch (error) {
      expect(error.message).toBe("Detected a loop");
    }
  });
});
