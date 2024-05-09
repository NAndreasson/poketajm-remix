
type Type = number | string

export function ensureDisjointTypes(types: Type[], weaknesses: Type[]) {
  const typeSet = new Set(types);
  for (const weakness of weaknesses) {
    if (typeSet.has(weakness)) {
      return false;
    }
  }
  return true;
}
