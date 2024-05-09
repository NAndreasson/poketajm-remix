import { prisma } from "~/db.server";
import { PersistedPokemon } from "~/types/pokemon";

type EvolutionChain = Pick<PersistedPokemon, "id" | "name" | "img">[];

// TODO: these only differ by the JOIN table, can we make this DRYer?
export function getPredecessorPokemons(id: PersistedPokemon["id"]) {
  return prisma.$queryRaw<EvolutionChain>`
        WITH RECURSIVE PokemonEvolutions AS (
            SELECT
            p.id,
            p.name,
            p.img,
            p."evolutionId"
            FROM
            public."Pokemon" p
            WHERE
            p.id = ${id}
            UNION ALL
            SELECT
            prev_p.id,
            prev_p.name,
            prev_p.img,
            prev_p."evolutionId"
            FROM
            PokemonEvolutions pe
            JOIN
            public."Pokemon" prev_p ON pe.id = prev_p."evolutionId"
        )
        SELECT
            id,
            name,
            img
        FROM
            PokemonEvolutions
        OFFSET 1;
        `;
}

export function getSuccessors(id: PersistedPokemon["id"]) {
  return prisma.$queryRaw<EvolutionChain>`
        WITH RECURSIVE PokemonEvolutions AS (
            SELECT
            p.id,
            p.name,
            p.img,
            p."evolutionId"
            FROM
            public."Pokemon" p
            WHERE
            p.id = ${id}
            UNION ALL
            SELECT
            next_p.id,
            next_p.name,
            next_p.img,
            next_p."evolutionId"
            FROM
            PokemonEvolutions pe
            JOIN
            public."Pokemon" next_p ON pe."evolutionId" = next_p.id
        )
        SELECT
            id,
            name,
            img
        FROM
            PokemonEvolutions
        OFFSET 1 
            ; 
        `;
}

export function getPokemonsWithoutPredecessors() {
    // All pokemons that don't have a evolutionId pointing to them
    return prisma.pokemon.findMany({
        where: {
            prevEvolution: null,
        },
    });
}

export function getPokemonsWithoutSuccessors() {
    return prisma.pokemon.findMany({
        where: {
            nextEvolution: null,
        },
    });
}