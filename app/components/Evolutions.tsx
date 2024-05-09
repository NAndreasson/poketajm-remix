import { PokemonListItem } from "~/components/PokemonListItem";

interface EvolutionsProps {
    label: string;
    data: React.ComponentProps<typeof PokemonListItem>['pokemon'][];
}

export function Evolutions(props: EvolutionsProps) {
    const { label, data } = props;

    return (
    <div className="mt-2">
      <h1 className="text-2xl">{label}</h1>
      <div className="flex flex-row gap-8">
        {data.length === 0 && <p>No {label}</p>}
        {data.map((item) => (
          <PokemonListItem key={item.id} pokemon={item} />
        ))}
      </div>
    </div>
    )
}