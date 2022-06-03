<script lang="ts">
import SideBar from "$lib/SideBar.svelte"
import { onMount } from "svelte"
import { fetchIndex } from "$lib/search"
import type { IndexEntry } from "$lib/search"
import { base } from "$app/paths"
import { goto, afterNavigate } from "$app/navigation"
import { page } from "$app/stores"
import { browser } from "$app/env"

let data: Promise<IndexEntry[]> = fetchIndex("data/index.json")
let selected: IndexEntry | undefined = undefined
let viewing: string
$: viewing = base + "/data/" + (selected?.target || "home.html")

let elSearch: SearchContainer | undefined

function onNavigate(event: CustomEvent<IndexEntry>) {
  console.log(event)
  const { name, namespace } = event.detail
  const url = new URL($page.url)
  url.searchParams.set("id", name)
  url.searchParams.set("ns", namespace)
  goto(url.toString())
}

onMount(async () => {
  const data_ = await data
  if (elSearch) {
    const el = elSearch
    const to = $page.url
    let name = to.searchParams.get("id") || undefined
    let namespace = to.searchParams.get("ns") || undefined
    if (name && namespace) {
      for (const entry of data_) {
        if (entry.name == name && entry.namespace == namespace) {
          selected = entry
          requestAnimationFrame(() => el.scrollToSelected())
          return
        }
      }
    }
  }
})
</script>

<div class="flex-container">
  <div id="sidebar">
    <noscript>
      <div>Is JavaScript enabled?</div>
    </noscript>
    {#await data}
      <div>Loading</div>
    {:then data}
      <SideBar
        data="{data}"
        bind:selected
        bind:this="{elSearch}"
        on:navigate="{onNavigate}"
      />
    {/await}
  </div>
  <div id="content">
    {#key viewing}
      <!-- otherwise iframe will mess up browsing history; `location.replace` can also be used -->
      <iframe title="help" style="width: 100%; height: 100%;" src="{viewing}">
      </iframe>
    {/key}
  </div>
</div>

<style lang="scss">
#sidebar {
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
}

#content {
  flex-grow: 1;
  overflow: hidden;
}

#content > iframe {
  border: 0;
}

.flex-container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

:global {
  html,
  body {
    margin: 0;
    height: 100%;
    box-sizing: border-box;

    font-family: "Trebuchet MS", Helvetica, sans-serif;
    font-size: 10pt;
  }

  * {
    box-sizing: inherit;
  }
}
</style>
