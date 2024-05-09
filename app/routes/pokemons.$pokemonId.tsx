import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { Evolutions } from "~/components/Evolutions";
import { Nemesis } from "~/components/PokemonNemesis";
import { PokemonType } from "~/components/PokemonType";
import { findAntagonisticPokemons } from "~/queries/findAntagonisticPokemons.server";
import { getPokemonById } from "~/queries/getPokemonById.server";
import {
  getPredecessorPokemons,
  getSuccessors,
} from "~/queries/pokemonEvolutionQueries.server";

const ParamSchema = z.coerce.number();

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.pokemonId, "pokemonId not found");

  const pokemonId = ParamSchema.parse(params.pokemonId);
  const pokemon = await getPokemonById(pokemonId);

  if (!pokemon) {
    throw new Response("Not Found", { status: 404 });
  }

  const [predecessors, successors, antagonisticPokemons] = await Promise.all([
    getPredecessorPokemons(pokemonId),
    getSuccessors(pokemonId),
    findAntagonisticPokemons(pokemonId, { limit: 1 }),
  ]);

  return json({ pokemon, predecessors, successors, antagonisticPokemons });
};

export default function PokemonDetailsPage() {
  const { pokemon, predecessors, successors, antagonisticPokemons } =
    useLoaderData<typeof loader>();
  const { types, weaknesses } = pokemon;

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-2xl font-bold">{pokemon.name}</h3>
      <img src={pokemon.img} alt={pokemon.name} className="w-32" />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Candy: {pokemon.candy}</p>
      <PokemonType label="Types" types={types.map(({ type }) => type)} />
      <PokemonType
        label="Weakness"
        types={weaknesses.map(({ type }) => type)}
      />
      <Nemesis pokemon={antagonisticPokemons[0]} />
      <Evolutions label="Predecessors" data={predecessors} />
      <Evolutions label="Successors" data={successors} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Pokemon not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
