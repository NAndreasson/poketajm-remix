import { Pokemon, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";

export function searchPokemons(search: string) {
  const similarityThreshold = 0.1;
  const query = Prisma.sql`
      SELECT "Pokemon".*
      FROM "Pokemon"
      WHERE similarity("Pokemon"."name", ${search}) > ${similarityThreshold}
      ORDER BY similarity("Pokemon"."name", ${search}) DESC;
  `;

  return prisma.$queryRaw<Pokemon[]>(query);
}