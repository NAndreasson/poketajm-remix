import { Pokemon } from "@prisma/client";
import { prisma } from "~/db.server";

interface TypeWithPokemonCount {
    id: string;
    name: string;
    _count: {
        pokemons: number;
    };
    pokemons: {
        pokemon: Pokemon;
    }[];
}

export function getTypes(): TypeWithPokemonCount[] {
    return prisma.type.findMany({
        include: {
            _count: {
                select: { pokemons: true },
            },
            pokemons: {
                take: 1,
                include: {
                    pokemon: true,
                },
            },
        },
    });
}