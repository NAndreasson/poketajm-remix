import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { PokemonListItem } from "~/components/PokemonListItem";
import { SortPokemonListInput } from "~/components/SortPokemonListInput";
import { getPokemonsByType } from "~/queries/getPokemonsByType.server";

// Create zod schema to validate the sort param param:order where order is asc or desc
const ParamSchema = z.enum(["name", "height", "weight"]);
const OrderSchema = z.enum(["asc", "desc"]);

const SortSchema = z.object({
  param: ParamSchema,
  order: OrderSchema,
});
type SortSchemaType = z.infer<typeof SortSchema>;

const typeIdSchema = z.coerce.number();

const SortParam = z.string().transform((value, ctx) => {
  // Split the value by :
  const [param, order] = value.split(":");
  const result = SortSchema.safeParse({ param, order });
  if (result.success) {
    return result.data;
  } else {
    // Could be further improved
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid sort param",
    });

    return z.NEVER;
  }
});

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.typeId, "typeId not found");

  const typeId = typeIdSchema.parse(params.typeId);
  const sortOrder = getSortOrder(request);

  const type = await getPokemonsByType(typeId, { sort: sortOrder });
  if (!type) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ type, sortOrder });
};

function getSortOrder(request: LoaderFunctionArgs["request"]) {
  const url = new URL(request.url);
  const sortParam = url.searchParams.get("sort");

  let sortOrder: SortSchemaType;
  if (sortParam) {
    // Validate the sort param
    const result = SortParam.safeParse(sortParam);
    if (!result.success) {
      // Don't like this sneaky throw, TODO fix
      throw new Response("Invalid sort param", { status: 400 });
    }
    sortOrder = result.data;
  } else {
    // Default sort order if not provided
    sortOrder = { param: "name", order: "asc" };
  }

  return sortOrder
}


export default function TypeDetailsPage() {
  const { type } = useLoaderData<typeof loader>();
  const { pokemons } = type;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <h3 className="sm:flex-auto text-2xl font-bold">{type.name} ({pokemons.length} pokemons)</h3>
        <SortPokemonListInput />
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
        {pokemons.map(({ pokemon }) => (
          <PokemonListItem key={pokemon.id} pokemon={pokemon} />
        ))}
      </ol>
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
    return <div>Type not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
