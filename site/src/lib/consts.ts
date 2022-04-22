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
  name_lower: string
  fullname_lower: string
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
      name_lower: entry[IDX_NAME].toLocaleLowerCase("en-US"),
      fullname_lower:
        entry[IDX_NAMESPACE].toLocaleLowerCase("en-US") +
        "." +
        entry[IDX_NAME].toLocaleLowerCase("en-US"),
    }
  })
}

function isSubsequence (s: string, query: string): boolean {
  let pos = 0;
  let queryPos = 0;

  while (queryPos < query.length) {
    const c = query[queryPos];
    const idx = s.indexOf(c, pos);

    if (idx === -1) {
      return false;
    }
    pos = idx + 1;
    ++queryPos;
  }

  return true;
}

export function matchSimple(item: IndexEntry, query: string): boolean {
  if (item.fullname_lower.indexOf(query) !== -1) {
    return true
  }
  return false
}

export function matchSubsequence(item: IndexEntry, query: string): boolean {
  return isSubsequence(item.fullname_lower, query)
}

export function matchNamespace(item: IndexEntry, query: string): boolean {
  // Try to escape any characters that have special meaning in a regex
  const quoted = query.replaceAll(/[.+*\\()[\]<>$|^]/g, "\\$&")
  const reQuery = new RegExp(quoted.replaceAll("\\.", ".*\\."))
  return reQuery.test(item.fullname_lower)
}
