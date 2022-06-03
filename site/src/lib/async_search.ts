import type { IndexEntry } from "./search"

export type FilterOption =
| { query: string }
| { in_packages: Array<string> }

export type SearchParams = {
    items: Array<IndexEntry>
    filters: Array<FilterOption>
}

export async function searchIdrisEntry({
    items,
    filters,
  }: SearchParams): Promise<Array<IndexEntry>> {
    // TODO: use service worker
    return []
}
