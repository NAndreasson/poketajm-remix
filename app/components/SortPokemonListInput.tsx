import { Form, useSubmit } from "@remix-run/react";

export function SortPokemonListInput() {
  const submit = useSubmit();

  return (
    <Form method="get" onChange={(event) => submit(event.currentTarget)}>
      <select
        name="sort"
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="name:asc">Name (ascending)</option>
        <option value="name:desc">Name (descending)</option>
        <option value="height:asc">Height (ascending)</option>
        <option value="height:desc">Height (descending)</option>
        <option value="weight:asc">Weight (ascending)</option>
        <option value="weight:desc">Weight (descending)</option>
      </select>
    </Form>
  );
}