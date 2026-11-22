/**
 * Deep-omit keys whose value is `null` or `undefined`.
 * Keeps `0`, `false`, and `''`.
 */
export function omitNullish(value) {
  if (Array.isArray(value)) {
    return value.map(omitNullish)
  }
  if (value !== null && typeof value === 'object') {
    const out = {}
    for (const [key, child] of Object.entries(value)) {
      if (child === null || child === undefined) continue
      out[key] = omitNullish(child)
    }
    return out
  }
  return value
}
