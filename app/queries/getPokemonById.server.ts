import { prisma } from "~/db.server";
import { PersistedPokemon } from "~/types/pokemon";

export function getPokemonById(id: PersistedPokemon["id"]) {
  // Get the type by id, along with the pokemons that have that type
  return prisma.pokemon.findUnique({
    where: { id },
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
}