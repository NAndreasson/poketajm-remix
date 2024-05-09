interface Props {
    label: string
    name: string
}

export function SimpleInput(props: Props) {
    const { label, name } = props

    return (
      <label className="flex w-full flex-col gap-1">
        <span>{label}: </span>
        <input
          name={name}
          className="flex-1 rounded-md border-2 px-3 text-lg leading-loose"
        />
      </label>
    )
}