import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, json, useLoaderData, useRouteError } from "@remix-run/react";
import { PokemonListItem } from "~/components/PokemonListItem";
import { Pokemon } from "@prisma/client";
import { searchPokemons } from "~/queries/searchPokemons.server";

export const meta: MetaFunction = () => [{ title: "Search results" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || ""

  if (q.length < 3) {
    throw new Response("Search query must be at least 3 characters", {
      status: 400,
    });
  }

  const pokemons = await searchPokemons(q);
  return json({
    pokemons,
    q,
  });
};

export default function SearchPage() {
  const { pokemons, q } = useLoaderData<typeof loader>();

  return <SearchResults searchQuery={q} pokemons={pokemons} />;
}

function NoResults({ searchString }: { searchString: string }) {
  return <p>No results for "{searchString}"</p>;
}

function SearchResults({
  pokemons,
  searchQuery,
}: {
  searchQuery: string;
  pokemons: Pokemon[];
}) {
  const hasNoResults = pokemons.length === 0;
  if (hasNoResults) {
    return <NoResults searchString={searchQuery} />;
  }

  return (
    <div className="w-full my-12">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {pokemons.map((pokemon) => (
          <PokemonListItem key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
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

  if (error.status === 400) {
    return <div>{error.data}</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}