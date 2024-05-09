import { prisma } from "~/db.server";

export function searchPokemons(search: string) {
 // TODO: not exactly fuzzy search, but close enough
  return prisma.pokemon.findMany({
    where: {
      name: { contains: search, mode: "insensitive" },
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
}