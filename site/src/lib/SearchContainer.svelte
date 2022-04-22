<script lang="ts">
import type { IndexEntry } from "$lib/consts"
import VirtualList from "@sveltejs/svelte-virtual-list"

export let data: IndexEntry[]
export let selected: IndexEntry | undefined
export let searchTerm = ""

function select(entry: IndexEntry) {
  selected = entry
}

import { fuzzyFilter1 } from "fuzzbunny/fuzzbunny"

function weighted(o) {
  let name = o.scores.name || 0
  let namespace = o.scores.namespace || 0
  return name * 5 + namespace
}
function search(searchTerm: string, data: IndexEntry[]): IndexEntry[] {
  if (searchTerm == "") return data
  return fuzzyFilter1(data, searchTerm, { fields: ["name", "namespace"] })
    .sort((a, b) => weighted(b) - weighted(a))
    .map((o) => o.item)
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
<div id="i2d_search_results">
  <VirtualList items="{search(searchTerm, data)}" let:item="{entry}">
    <li
      class="indexentry"
      class:result-selected="{selected === entry}"
      on:click="{() => select(entry)}"
    >
      <div class="name">{entry.name}</div>
      <div>
        <span class="namespace dimmed">{entry.namespace}</span>
        <span class="package dimmed">[{entry.package}]</span>
      </div>
    </li>
  </VirtualList>
</div>

<style>
@import "../style.css";
</style>
