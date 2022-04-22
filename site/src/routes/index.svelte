<script lang="ts">
import SearchContainer from "$lib/SearchContainer.svelte"
import { onMount } from "svelte"
import { fetchIndex } from "$lib/consts"
import type { IndexEntry } from "$lib/consts"

let data: Promise<IndexEntry[]> | undefined
let selected: IndexEntry | undefined
let viewing : string
$: viewing = "data/" +  (selected?.target || "home.html")

onMount(() => {
  data = fetchIndex()
})
</script>

<div class="flex-container">
  <div id="sidebar">
    {#if data}
      {#await data}
        <div>Loading</div>
      {:then data}
        <SearchContainer data="{data}" bind:selected />
      {/await}
    {:else}
      <div>Is JavaScript enabled?</div>
    {/if}
  </div>
  <div id="content">
    <iframe
      title="help"
      style="width: 100%; height: 100%;"
      src={viewing}
    >
    </iframe>
  </div>
</div>

<style>
@import "../style.css";
</style>
