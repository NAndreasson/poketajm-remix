import { Type } from "@prisma/client";

interface Props {
  label: string;
  name: string;
  types: Type[];
}

export function TypeInput(props: Props) {
  const { label, name, types } = props;

  return (
    <div>
      <label className="flex w-full flex-col gap-1">
        <span>{label}: </span>
      </label>
      <div className="grid grid-cols-3 mt-2">
      {types.map((type) => (
        <label key={type.id} className="flex items-center ">
          <input
            type="checkbox"
            name={name}
            value={type.id}
            className="rounded mr-2"
          />
          {type.name}
        </label>
      ))}
      </div>
    </div>
  );
}
