import { Pokemon } from "@prisma/client";
import { PokemonListItem } from "./PokemonListItem";

export function Nemesis({ pokemon }: { pokemon?: Pokemon }) {
  return (
    <div>
      <h1 className="text-2xl">Nemesis</h1>
      {pokemon ? (
        <PokemonListItem key={pokemon.id} pokemon={pokemon} />
      ) : (
        <div>No nemesis found, lucky Poké</div>
      )}
    </div>
  );
}
