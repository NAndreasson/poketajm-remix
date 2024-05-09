import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { Pokemon } from "~/types/pokemon";
import { getPokemonById } from "./getPokemonById.server";
import { getPredecessorPokemons, getSuccessors } from "./pokemonEvolutionQueries.server";

interface CreatePokemonInput extends Pokemon {
  predecessorId?: number;
}

export async function createPokemon(pokemon: CreatePokemonInput) {
  const { predecessorId, evolutionId } = pokemon;
  console.log("Predecessor", predecessorId)
  console.log("Evolution", evolutionId)
  if (predecessorId) {
    assertPredecessorWithoutSuccessor({ predecessorId });
  }

  if (evolutionId) {
    assertSuccessorWithouPredecessor({ evolutionId }); 
  }

  if (predecessorId && evolutionId) {
    assertNoEvolutionaryLoop({ predecessorId, evolutionId });
  }

  console.log("Creating Pokemon")
  return prisma.$transaction(async (tx) => {
    const createPokemonQuery = await tx.pokemon.create({
      data: {
        name: pokemon.name,
        img: pokemon.img,
        height: pokemon.height,
        weight: pokemon.weight,
        num: pokemon.num,
        candy: pokemon.candy,
        evolutionId: pokemon.evolutionId,
        types: {
          create: buildConnectTypeQuery(pokemon.types),
        },
        weaknesses: {
          create: buildConnectTypeQuery(pokemon.weaknesses),
        },
      },
      include: {
        types: {
          include: {
            type: true,
          },
        },
        weaknesses: {
          include: {
            type: true,
          },
        },
      },
    });

    // Now update the predecessor and evolution
    if (predecessorId) {
      await tx.pokemon.update({
        where: { id: predecessorId },
        data: {
          evolutionId: createPokemonQuery.id,
        },
      });
    }
    return createPokemonQuery;
  });
}

async function assertPredecessorWithoutSuccessor({ predecessorId }: { predecessorId: number }) {
    const predecessorPokemon = await getPokemonById(predecessorId);
    invariant(predecessorPokemon, "Predecessor not found")
    const successorToPredecessor = await getSuccessors(predecessorId);
    // Throw if there's already a successor to the predecessor
    if (successorToPredecessor.length > 0) {
      throw new Error("Predecessor already has a successor");
    }
}

async function assertSuccessorWithouPredecessor({ evolutionId }: { evolutionId: number }) {
    const evolutionPokemon = await getPokemonById(evolutionId);
    invariant(evolutionPokemon, "Evolution not found")
    const predecessorsToEvolution = await getPredecessorPokemons(evolutionId);
    // Throw if there's already a predecessor to the evolution
    if (predecessorsToEvolution.length > 0) {
      throw new Error("Evolution already has a predecessor");
    }
}

async function assertNoEvolutionaryLoop({ predecessorId, evolutionId }: { predecessorId: number; evolutionId: number }) {
    // Handle loops, e.g. we add a new Pokemon called `Charmandy`, there's
    // already an evolution chain Charimander -> Charmeleon -> Charizard...
    // If we specify that Charmandy evolves from Charizard and Charimander evolves from Charmandy, we have a loop
    // Apart from existential questions like, what came first, the
    // Charmander or the Charmandy, id's not ideal given our use of
    // recursive queries in the DB
    const successorsOfEvolution = await getSuccessors(evolutionId);
    if (successorsOfEvolution.some(({ id }) => id === predecessorId)) {
      throw new Error("Detected a loop");
    }
}

function buildConnectTypeQuery(typeIds: number[]) {
  return typeIds.map((typeId: number) => ({
    type: {
      connect: {
        id: typeId,
      },
    },
  }));
}