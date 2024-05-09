import { PrismaClient } from "@prisma/client";
import pokemonsJSON from "./pokemons.json";

const prisma = new PrismaClient();

async function createTypes() {
  const pokemons = pokemonsJSON["pokemon"];
  const types = new Set<string>();

  for (const pokemon of pokemons) {
    for (const type of pokemon["type"]) {
      types.add(type);
    }
  }

  for (const type of types) {
    try {
      await prisma.type.create({
        data: {
          name: type,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}

async function createPokemons() {
  const pokemons = pokemonsJSON["pokemon"];

  for (const pokemon of pokemons) {
    try {
      await prisma.pokemon.create({
        data: {
          name: pokemon["name"],
          num: pokemon["num"],
          img: pokemon["img"],
          height: pokemon["height"],
          weight: pokemon["weight"],
          candy: pokemon["candy"],
          types: {
            create: pokemon["type"].map((type: string) => ({
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
            create: pokemon["weaknesses"].map((type: string) => ({
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
    } catch (error) {
      console.error(`Error creating pokemon ${pokemon["name"]}`, error);
    }
  }
}

// Connect evolutions
async function connectEvolutions() {
  const pokemons = pokemonsJSON["pokemon"];

  for (const pokemon of pokemons) {
    const nextEvolutions = pokemon["next_evolution"];
    if (nextEvolutions) {
      // Get the last evolution, think this is correct
      const nextEvolution = nextEvolutions[0];
      // Get the ID of the next evolution
      const nextEvolutionPokemon = await prisma.pokemon.findUnique({
        where: {
          num: nextEvolution["num"],
        },
      });
      if (nextEvolutionPokemon) {
        try {
          await prisma.pokemon.update({
            where: {
              num: pokemon["num"],
            },
            data: {
              evolutionId: nextEvolutionPokemon.id,
            },
          });
        } catch (error) {
          console.error(
            `Error connecting evolutions for ${pokemon["name"]}`,
            error,
          );
        }
      } else {
        console.error(`Could not find next evolution for ${pokemon["name"]}`);
      }
    }
  }
}

async function seed() {
  await createTypes();
  await createPokemons();
  await connectEvolutions();

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
