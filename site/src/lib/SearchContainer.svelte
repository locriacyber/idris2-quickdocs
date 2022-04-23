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
import type { FuzzyFilterResult1 } from "fuzzbunny/fuzzybunny-extra";

function weighted(o: FuzzyFilterResult1<IndexEntry>) {
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
.searchbox-container {
  width: 100%;
  height: 31px;
  flex-shrink: 0;
  background-color: rgb(37, 37, 37);
  /*border-bottom: 3px solid rgb(101, 159, 219);*/
  display: flex;
  flex-direction: row;
  position: relative;
}

.searchbox {
  width: 100%;
}

.searchbox-container input:focus + .key-shortcut {
  opacity: 0;
}

.searchbox-container:hover .key-shortcut {
  opacity: 0;
}

.searchbox-container .key-shortcut {
  opacity: 1;
  color: rgb(101, 159, 219);
  position: absolute;
  right: 6px;
  top: 6px;
  border: 1px solid rgb(101, 159, 219);
  border-radius: 5px;
  padding: 1px 4px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
  transition: ease-out;
  transition-duration: 0.1s;
  font-size: 12px;
  background-color: white;
  pointer-events: none;
}

#i2d_search_results {
  flex-grow: 1;
  overflow: hidden;
}

.indexentry {
  position: relative;
}

.indexentry .package {
  float: right;
  text-align: right;
  font-size: 85%;
}

.indexentry .name {
  color: #000;
  font-family: Mensch, Menlo, "DejaVu Sans Mono", monospace;
  background-color: inherit;
}

.indexentry > * {
  /* display: block; */
  padding: 4px;
  background-color: inherit;

  color: #000;
  text-decoration: none;
}

.indexentry .dimmed {
  color: #999;
}

.result-selected .dimmed {
  color: rgb(50, 80, 109);
}

.indexentry:hover {
  background-color: #eee;
}

.result-selected, .result-selected:hover {
  background-color: rgb(101, 159, 219);
}
</style>
