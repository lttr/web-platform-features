export function objectKeys<Obj extends Record<string, unknown>>(
  obj: Obj,
): (keyof Obj)[] {
  return Object.keys(obj) as (keyof Obj)[]
}
