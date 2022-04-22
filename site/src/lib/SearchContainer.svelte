<script lang="ts">
import { matchSimple, matchNamespace, matchSubsequence } from "$lib/consts"
import type { IndexEntry } from "$lib/consts"

export let data: IndexEntry[]
export let selected: IndexEntry | undefined
let searchTerm = ""

function select(entry: IndexEntry) {
  selected = entry
}

function matchSearchTerm(searchTerm: string, entry: IndexEntry): boolean {
  if (searchTerm == "") return true
  const query = searchTerm.toLocaleLowerCase("en-US")
  return matchSimple(entry, query)
}

function keyOfEntry(entry: IndexEntry): string {
  return entry.name + "\0" + entry.namespace + "\0" + entry.package
}
</script>

<div class="searchbox-container">
  <input
    type="text"
    class="searchbox"
    id="i2d_searchbox"
    placeholder="Type to begin searching"
    bind:value="{searchTerm}"
  />
  <span class="key-shortcut">Tab ⇥</span>
</div>
<ul id="i2d_search_results">
  {#each data as entry (entry)}
    <li
      class="indexentry"
      class:result-selected="{selected === entry}"
      class:hidden="{!matchSearchTerm(searchTerm, entry)}"
      on:click="{() => select(entry)}"
    >
      <div class="name">{entry.name}</div>
      <div>
        <span class="namespace dimmed">{entry.namespace}</span>
        <span class="package dimmed">[{entry.package}]</span>
      </div>
    </li>
  {/each}
</ul>

<style>
@import "../style.css";

.hidden {
  display: none;
}
</style>
