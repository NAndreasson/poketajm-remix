import type { ActionFunctionArgs } from "@remix-run/node";
import {
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { EvolutionInput } from "~/components/EvolutionInput";
import { SimpleInput } from "~/components/SimpleInput";
import { TypeInput } from "~/components/TypeInput";
import { createPokemon } from "~/queries/createPokemon.server";
import { getTypes } from "~/queries/getTypes.server";
import {
  getPokemonsWithoutPredecessors,
  getPokemonsWithoutSuccessors,
} from "~/queries/pokemonEvolutionQueries.server";
import { ensureDisjointTypes } from "~/utils/set";

// TODO: move into separate file
const pokemonCreateSchema = z
  .object({
    name: z.string(),
    types: z.array(z.coerce.number()).min(1),
    weaknesses: z.array(z.coerce.number()),
    height: z.string(),
    weight: z.string(),
    candy: z.string(),
    num: z.string(),
    predecessorId: z
      .string()
      .transform((value) => (value === "" ? undefined : Number(value)))
      .optional(),
    evolutionId: z
      .string()
      .transform((value) => (value === "" ? undefined : Number(value)))
      .optional(),
    img: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!ensureDisjointTypes(data.types, data.weaknesses)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Weaknesses may not overlap with types",
      });
    }
    return data;
  });

export const action = async ({ request }: ActionFunctionArgs) => {
  const parseResult = await parsePokemonFormData(request);

  if (!parseResult.success) {
    const errors = parseResult.error.errors;
    return json(
      { errors: errors.map((error) => error.message) },
      { status: 400 },
    );
  }

  try {
    const pokemon = await createPokemon(parseResult.data);
    return redirect(`/pokemons/${pokemon.id}`);
  } catch (error) {
    return json({ errors: ["Failed to create pokemon"] }, { status: 500 });
  }
};

export const loader = async () => {
  const [types, pokemonsWithoutSuccessors, pokemonsWithoutPredecessors] =
    await Promise.all([
      getTypes(),
      getPokemonsWithoutSuccessors(),
      getPokemonsWithoutPredecessors(),
    ]);

  return json({
    types,
    pokemonsWithoutSuccessors,
    pokemonsWithoutPredecessors,
  });
};

async function parsePokemonFormData(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name");
  const evolutionId = formData.get("evolutionId");
  const predecessorId = formData.get("predecessorId");
  const types = formData.getAll("types");
  const weaknesses = formData.getAll("weaknesses");

  return pokemonCreateSchema.safeParse({
    name,
    types,
    weaknesses,
    num: formData.get("num"),
    height: formData.get("height"),
    evolutionId,
    predecessorId,
    weight: formData.get("weight"),
    candy: formData.get("candy"),
    // TODO: fix together with file upload
    img: "http://www.serebii.net/pokemongo/pokemon/001.png",
  });
}

export default function NewPokemonPage() {
  const actionData = useActionData<typeof action>();
  const { types, pokemonsWithoutPredecessors, pokemonsWithoutSuccessors } =
    useLoaderData<typeof loader>();

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {actionData?.errors && (
        <div className="text-red-700">
          {actionData.errors.map((error) => (
            <div key={error}>{error}</div>
          ))}
        </div>
      )}

      <SimpleInput label="Name" name="name" />

      <TypeInput label="Types" name="types" types={types} />
      <TypeInput label="Weaknesses" name="weaknesses" types={types} />

      <SimpleInput label="Height" name="height" />
      <SimpleInput label="Weight" name="weight" />
      <SimpleInput label="Candy" name="candy" />
      <SimpleInput label="Num" name="num" />

      <EvolutionInput label="Predecessor" name="predecessorId" pokemons={pokemonsWithoutSuccessors} />
      <EvolutionInput label="Successor" name="evolutionId" pokemons={pokemonsWithoutPredecessors} />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
