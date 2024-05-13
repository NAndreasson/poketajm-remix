import { Pokemon } from "@prisma/client";
import { prisma } from "~/db.server";

interface TypeWithPokemonCount {
    id: number;
    name: string;
    _count: {
        pokemons: number;
    };
    pokemons: {
        pokemon: Pokemon;
    }[];
}

export function getTypes(): Promise<TypeWithPokemonCount[]> {
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