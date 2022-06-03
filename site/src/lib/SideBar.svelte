<script lang="ts">
import type { IndexEntry } from "$lib/search"
import { search } from "$lib/search"
import { createEventDispatcher } from "svelte"
import VirtualList from "svelte-virtual-list-ce"
import { searchIdrisEntry } from "./async_search";
import IdrisEntry from "./IdrisEntry.svelte";
import PackageFilter from "./PackageFilter.svelte";
import SearchBox from "./SearchBox.svelte";

export let data: IndexEntry[] = []
export let searchTerm = ""
export let selected: IndexEntry | undefined
let filterOpen = false

function toggelFilter() {
  filterOpen = !filterOpen
}

let allPackages: Set<string>
$: {
  allPackages = new Set()
  data.forEach(entry => {
    allPackages.add(entry.package)
  })
}

let search_results: IndexEntry[] = []
let selectedPackages: Array<string> = []
let filterEnabled: boolean

$: {
  let filters = []
  const query = searchTerm.trim()
  if (query) filters.push({query})
  if (filterEnabled) filters.push({in_packages: selectedPackages})
  searchIdrisEntry({
    items: data,
    filters
  }).then(r => search_results = r)
}

/* scrolling magic below, no touch */

let el_list: VirtualList | undefined
$: {
  searchTerm
  el_list?.scrollToIndex(0, {
    behavior: 'auto'
  })
}

export function scrollToSelected() {
  if (el_list && selected) {
    for (let i =0;i<data.length;i++) {
      if (data[i] == selected) {
        el_list.scrollToIndex(i, {behavior:'auto'}) // this is buggy as fuck; can't even scroll to correct location
      }
    }
  }
}

const dispatch = createEventDispatcher();

export function select(entry: IndexEntry) {
  selected = entry
  dispatch("navigate", selected)
}
</script>


<div class="flex">
  <SearchBox bind:value={searchTerm}/>
  <dir id="info">
    <span>{search_results.length} Results</span>
    <button on:click={toggelFilter}>filter</button>
  </dir>
  {#if filterOpen}
    <PackageFilter items={Array.from(allPackages).sort()} bind:value={selectedPackages} bind:enabled={filterEnabled}/>
  {/if}
  <div id="results">
    <VirtualList items={search_results} bind:this={el_list} let:item={entry}>
      <IdrisEntry entry={entry} selected={selected === entry} on:click="{() => select(entry)}"/>
    </VirtualList>
  </div>
</div>


<style lang="scss">
  .flex {
    display: flex;
    flex-direction: column;
    height: 100%;
    > * {
      margin: 0;
      padding: 0;
    }
  }
  #info {
    box-shadow: inset 0px 0px 5px #ccc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  #results {
    flex-grow: 1;
    overflow: hidden;
  }
</style>
