import type { Type } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Type } from "@prisma/client"

type Sort = {
  param: "name" | "height" | "weight"
  order: "asc" | "desc"
}

type Options = {
    sort?: Sort
}

export function getPokemonsByType(id: Type["id"], options?: Options) {
    const orderBy = getOrderBy(options);

    return prisma.type.findUnique({
        where: { id },
        include: { pokemons: {
            include: {
                pokemon: true,
            },
            orderBy: orderBy ? { pokemon: orderBy } : undefined,
        } },
    });
}

function getOrderBy(options?: Options) {
    const sort = options?.sort || { param: "name", order: "asc" };
    const orderBy = { [sort.param]: sort.order }

    return orderBy
}