import { search, type IndexEntry } from "./search"
import * as _ from "lodash"

export type FilterOption = {
  query?: string
  in_packages?: Array<string>
}

export type PackageName = string

export type SearchParams = {
  items: Map<PackageName, Array<IndexEntry>>
  options: FilterOption
}

function stringmatched(query: string, datum: string): boolean {
  return datum.toLowerCase().indexOf(query.toLowerCase()) != -1
}

export function* searchIdrisEntry({
  items,
  options,
}: SearchParams): Iterable<IndexEntry> {
  let entries: Array<IndexEntry>
  if (options.in_packages) {
    const in_packages = options.in_packages
    entries = Array.from(items.entries())
      .filter(([key, value]) => in_packages.indexOf(key) != -1)
      .map(([key, value]) => value)
      .flat()
  } else {
    entries = Array.from(items.values()).flat()
  }

  if (options.query) {
    for (const entry of entries) {
      if (!entry.fullname) entry.fullname = entry.namespace + "." + entry.name
    }
    yield* search(options.query, entries)
  } else {
    yield* entries
  }
}
