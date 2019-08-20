export function mapToObject(map: Map<string, boolean>) {
  const obj: { [key: string]: boolean } = {};
  for (let key of map.keys()) {
    obj[key] = map.get(key) as boolean;
  }
  return obj;
}
