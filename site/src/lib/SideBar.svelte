<script lang="ts">
import type { IndexEntry } from "$lib/search"
import { search } from "$lib/search"
import { createEventDispatcher } from "svelte"
import VirtualList from "svelte-virtual-list-ce"
import IdrisEntry from "./IdrisEntry.svelte";
import SearchBox from "./SearchBox.svelte";

export let data: IndexEntry[] = []
export let searchTerm = ""
export let selected: IndexEntry | undefined

let search_results: IndexEntry[] = []
$: search_results = search(searchTerm, data)

let el_list: VirtualList | undefined
$: {
  searchTerm
  el_list?.scrollToIndex(0, {
    behavior: 'auto'
  })
}

let v_start = 0, v_end = 0

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


<SearchBox bind:value={searchTerm}/>
<dir id="info">
  <span>{search_results.length} Results</span>
  <button>filter</button>
</dir>
<div id="results">
  <VirtualList items={search_results} bind:this={el_list} let:item={entry} bind:start={v_start} bind:end={v_end}>
    <IdrisEntry entry={entry} selected={selected === entry} on:click="{() => select(entry)}"/>
  </VirtualList>
</div>

<style>
  #info {
    margin: 0;
    padding: 0.5em 0 0 0.2em;
    box-shadow: inset 0px 0px 5px #ccc;
    line-height: 1;
  }
  
  #results {
    flex-grow: 1;
    overflow: hidden;
  }
</style>
