/**
 * Transforme récursivement un payload en remplaçant les objets contenant une clé `tmp`
 * par la valeur de cette clé directement au niveau parent.
 *
 * @example
 * Input: { coverImageId: { tmp: "uuid-123", originalName: "image.png" } }
 * Output: { coverImageId: "uuid-123" }
 *
 * @param payload - L'objet à transformer
 * @returns L'objet transformé
 */
export function transformTmpPayload<T = any>(payload: T): T {
  if (payload === null || payload === undefined) {
    return payload
  }

  // Si c'est un tableau, transformer chaque élément
  if (Array.isArray(payload)) {
    return payload.map(item => transformTmpPayload(item)) as T
  }

  // Si ce n'est pas un objet, retourner tel quel
  if (typeof payload !== 'object') {
    return payload
  }

  // Si l'objet contient une clé 'tmp', retourner sa valeur
  if ('tmp' in payload && typeof payload === 'object') {
    return (payload as any).tmp
  }

  // Sinon, transformer récursivement chaque propriété
  const result: any = {}
  for (const [key, value] of Object.entries(payload)) {
    result[key] = transformTmpPayload(value)
  }

  return result as T
}