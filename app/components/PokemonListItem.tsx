import { Link } from "@remix-run/react";
import { PokemonImage } from "./PokemonImage";
import { Pokemon } from "@prisma/client";

interface Props {
  pokemon: Pick<Pokemon, "id" | "name" | "img"> & { weight?: string; height?: string };
}

export function PokemonListItem({ pokemon }: Props) {
  return (
    <li className="py-4 flex" data-testid="show-list-item">
      <Link to={`/pokemons/${pokemon.id}`}>
        <PokemonImage name={pokemon.name} img={pokemon.img} />
      </Link>
      <div className="p-4">
        <h1 className="text-xl md:text-2xl">
          <Link to={`/pokemons/${pokemon.id}`}>{pokemon.name}</Link>
        </h1>
        <div className="mt-2">
        {pokemon.height && (
          <p>
            <strong>Height:</strong> {pokemon.height}
          </p>
        )}
        {pokemon.weight && (
          <p>
            <strong>Weight:</strong> {pokemon.weight}
          </p>
        )}</div>
      </div>
    </li>
  );
}
