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

export async function fetchIndex(url) {
  let res = await fetch(url)
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

import { fuzzyFilter1 } from "fuzzbunny/fuzzbunny.ts"
import type { FuzzyFilterResult1 } from "fuzzbunny/fuzzybunny-extra";

export function weighted(o: FuzzyFilterResult1<IndexEntry>) {
    let name = o.scores.name || 0
    let namespace = o.scores.namespace || 0
    return name * 5 + namespace
}
  
export function search(searchTerm: string, data: IndexEntry[]): IndexEntry[] {
    if (searchTerm == "") return data
    return fuzzyFilter1(data, searchTerm, { fields: ["name", "namespace"] })
      .sort((a, b) => weighted(b) - weighted(a))
      .map((o) => o.item)
}
