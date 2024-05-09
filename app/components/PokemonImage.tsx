interface Pokemon {
  name: string;
  img: string;
}

export const ImageContainer = (props: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-24 md:w-36 aspect-[210/295] ${props.className ?? ""}`}>
    {props.children}
  </div>
);

const MissingImagePlaceholder = () => (
  <div className="bg-gray-200 w-full h-full">
    <div className="flex flex-col justify-center h-full text-center">
      Missing image
    </div>
  </div>
);

interface PokemonImageProps extends Pick<Pokemon, "name" | "img"> {
  className?: string;
}

export function PokemonImage(props: PokemonImageProps) {
  const { img, name, className = "" } = props;

  return (
    <ImageContainer className={`flex-shrink-0 ${className}`}>
      {img && <img src={img} alt={`Image for ${name}`} className="w-full" />}
      {!img && <MissingImagePlaceholder />}
    </ImageContainer>
  );
}
