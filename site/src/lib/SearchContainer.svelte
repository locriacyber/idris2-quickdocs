<script lang="ts">
import type { IndexEntry } from "$lib/search"
import { search } from "$lib/search"
import VirtualList from "svelte-virtual-list-ce"
import { goto, afterNavigate } from "$app/navigation"
import { page } from "$app/stores"
import { onMount, createEventDispatcher } from "svelte";

export let data: IndexEntry[] = []
export let searchTerm = ""
export let selected: IndexEntry | undefined

onMount(() => {
  requestAnimationFrame(scrollToSelected)
})

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
    // el_list.scrollToIndex(0)
    for (let i =0;i<data.length;i++) {
      if (data[i] == selected) {
        el_list.scrollToIndex(i) // this is buggy as fuck; can't even scroll to correct location
      }
    }
  }
  
  // TODO : fix this
  // the below is buggy
  // for (let i =0;i<data.length;i++) {
  //   if (selected && data_eq(data[i], selected)) {
  //     el_list?.scrollToIndex(i, {
  //       behavior: 'auto',
  //     })
  //     break
  //   }
  // }
}

const dispatch = createEventDispatcher();

export function select(entry: IndexEntry) {
  selected = entry
  dispatch("navigate", selected)
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
<dir id="i2d_search_info">{search_results.length} Results</dir>
<div id="i2d_search_results">
  <VirtualList items={search_results} bind:this={el_list} let:item={entry} bind:start={v_start} bind:end={v_end}>
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

#i2d_search_info {
  margin: 0;
  padding: 0.5em 0 0 0.2em;
  box-shadow: inset 0px 0px 5px #ccc;
  line-height: 1;
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

.result-selected,
.result-selected:hover {
  background-color: rgb(101, 159, 219);
}
</style>
