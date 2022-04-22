export const IDX_NAME = 0
export const IDX_NAMESPACE = 1
export const IDX_PACKAGE = 2
export const IDX_TARGET = 3
export const IDX_NAME_LOWER = 4
export const IDX_FULLNAME_LOWER = 5

export type IndexEntryRaw = {
  [IDX_NAME]: string
  [IDX_NAMESPACE]: string
  [IDX_PACKAGE]: string
  [IDX_TARGET]: string
}

export type IndexEntry = {
  name: string
  namespace: string
  package: string
  target: string
}

export async function fetchIndex() {
  let res = await fetch("data/index.json")
  let rawData = (await res.json()) as IndexEntryRaw[]
  return rawData.map((entry) => {
    return {
      name: entry[IDX_NAME],
      namespace: entry[IDX_NAMESPACE],
      package: entry[IDX_PACKAGE],
      target: entry[IDX_TARGET],
    }
  })
}
