import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { getTypes } from "~/queries/type.server";
import { searchPokemons } from "~/queries/searchPokemons.server";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  // TODO: run these in parallel

  const types = await getTypes();

  if (q) {
    const pokemons = await searchPokemons(q);
    return json({
      pokemons,
      types,
    });
  } else {
    return json({
      types,
    });
  }
};

export default function Index() {
  const { types } = useLoaderData<typeof loader>();

  return <BrowsePokemonByType types={types} />;
}

function BrowsePokemonByType({ types }: { types: ReturnType<typeof useLoaderData<typeof loader>>["types"]}) {
  return (
    <div className="w-full my-12">
      <h1 className="font-display text-3xl tracking-tight tet-slate-900">
        Browse Pokemon by Type
      </h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => (
          <li key={type.id}>
            <h2 className="mt-4 font-display text-xl text-slate-900">
              <Link to={`/types/${type.id}`}>{type.name}</Link>
              <span className="ml-2 text-sm text-slate-500">({type._count.pokemons} Pokémon)</span>
            </h2>
            <div className="mt-4">
            {type.pokemons && type.pokemons.length > 0 ? (
              <img src={type.pokemons[0].pokemon.img} alt={type.name} className="max-w-full h-auto rounded-md" />
            ) : (
              <p className="text-slate-500">No img found</p>
            )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
