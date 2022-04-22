<script lang="ts">
import type { IndexEntry } from "$lib/consts"
import Fuse from "fuse.js"
import VirtualList from "@sveltejs/svelte-virtual-list"

export let data: IndexEntry[]
export let selected: IndexEntry | undefined
let searchTerm = ""

const options = {
  keys: ["name", "namespace", "package"],
}

$: fuse = new Fuse(data, options)

function select(entry: IndexEntry) {
  selected = entry
}

function matched(searchTerm: string, data: IndexEntry[]): IndexEntry[] {
  if (searchTerm == "") return data
  return fuse.search(searchTerm).map((o) => o.item)
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
  <VirtualList items="{matched(searchTerm, data)}" let:item="{entry}">
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
