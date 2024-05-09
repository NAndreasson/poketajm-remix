import { Pokemon } from "@prisma/client";

interface Props {
    label: string;
    name: string;
    pokemons: Pick<Pokemon, 'name' | 'id'>[];
}

export function EvolutionInput(props: Props) {
    const { label, name, pokemons } = props;
    return (
    <label className="flex w-full flex-col gap-1">
      <span>{label}: </span>
      <select
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        name={name}
      >
        <option value="">Select a pokemon</option>
        {pokemons.map((poke) => (
          <option key={poke.id} value={poke.id}>
            {poke.name}
          </option>
        ))}
      </select>
    </label>
    )    
}