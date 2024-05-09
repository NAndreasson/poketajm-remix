import { Type } from "@prisma/client";
import { Link } from "@remix-run/react";

export function PokemonType({
  label,
  types,
}: {
  label: string;
  types: Type[];
}) {
  return (
    <div className="mt-2">
      <h1 className="text-2xl mb-4">{label}</h1>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer focus:outline-none undefined border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
          >
            <Link to={`/types/${type.id}`}>{type.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
