import { PrismaClient } from "@prisma/client";
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const pokemonTypes = [
    "Grass",
    "Poison",
    "Fire",
    "Flying",
    "Water",
    "Bug",
    "Normal",
    "Electric",
    "Ground",
    "Fairy",
    "Fighting",
    "Psychic",
    "Rock",
    "Steel",
    "Ice",
    "Ghost",
    "Dragon",
    "Dark",
];

// See if can reuse Prisma model
interface Pokemon {
  id: number
  name: string;
  num: string;
  img: string;
  height: string;
  weight: string;
  candy: string;
  types: string[];
  weaknesses: string[];
  evolutionId?: number;
}

interface PokemonType {
    id: number;
    name: string;
}

export async function resetDB() {
  const deleteTypesOnPokemons = prisma.typesOnPokemons.deleteMany({});
  const deleteWeaknesses = prisma.weaknessesOnPokemons.deleteMany({});
  const deletePokemons = prisma.pokemon.deleteMany({});
  const deleteTypes = prisma.type.deleteMany({});

  await prisma.$transaction([
    deleteTypesOnPokemons,
    deleteWeaknesses,
    deleteTypes,
    deletePokemons,
  ]);
}

// Sample types
export const typeFactory = Factory.define<PokemonType>(({ sequence, params, onCreate }) => {
    onCreate((type) => createType(type));

    const name = params.name || faker.helpers.arrayElement(pokemonTypes);
    return {
        id: sequence,
        name,
    };
})

export const pokemonFactory = Factory.define<Pokemon>(({ sequence, params, onCreate }) => {
    onCreate((pokemon) => createPokemon(pokemon));

        // Not the most credible pokemon data
    const name = params.name || faker.person.fullName();
    const candy = params.candy || `${name} candy`
    const height = params.height || `${faker.number.int().toString()} cm`
    const weight = params.height || `${faker.number.int().toString()} kg`
    const img = params.img || faker.image.url()
    const num = params.num || faker.number.int().toString()

    const types = Array.isArray(params.types) && params.types.length > 0 ? params.types : [typeFactory.build().name]
    const weaknesses = params.weaknesses || [typeFactory.build().name]
    const evolutionId = params.evolutionId
    
    return {
        id: sequence,
        name,
        num,
        img,
        height,
        weight,
        candy,
        types,
        weaknesses,
        evolutionId

    }
})

async function createType(type: PokemonType) {
    return prisma.type.create({
        data: {
            name: type.name,
        },
    });
}

async function createPokemon(pokemon: Pokemon) {
  return prisma.pokemon.create({
    data: {
      name: pokemon.name,
      img: pokemon.img,
      height: pokemon.height,
      weight: pokemon.weight,
      num: pokemon.num,
      candy: pokemon.candy,
      evolutionId: pokemon.evolutionId,
      types: {
        create: pokemon.types.map((type: string) => ({
          type: {
            connectOrCreate: {
              where: {
                name: type,
              },
              create: {
                name: type,
              },
            },
          },
        })),
      },
      weaknesses: {
        create: pokemon.weaknesses.map((type: string) => ({
          type: {
            connectOrCreate: {
              where: {
                name: type,
              },
              create: {
                name: type,
              },
            },
          },
        })),
      },
    },
  });
}