import invariant from "tiny-invariant";
import { getPokemonById } from "./getPokemonById.server";
import { PersistedPokemon } from "~/types/pokemon";
import { prisma } from "~/db.server";

type Options = {
  limit?: number
}

export async function findAntagonisticPokemons(id: PersistedPokemon["id"], options?: Options) {
  const providedPokemon = await getPokemonById(id);
  invariant(providedPokemon, "Pokemon not found")

  const providedPokemonTypeIds = providedPokemon.types.map(
    ({ typeId }) => typeId,
  );
  const providedPokemonWeaknessTypeIds = providedPokemon.weaknesses.map(
    ({ typeId }) => typeId,
  );

  return prisma.pokemon.findMany({
    where: {
      AND: [
        {
          types: {
            some: {
              typeId: {
                in: providedPokemonWeaknessTypeIds,
              },
            },
          },
        },
        {
          weaknesses: {
            none: {
              typeId: {
                in: providedPokemonTypeIds,
              },
            },
          },
        },
      ],
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
    take: options?.limit
  });
}