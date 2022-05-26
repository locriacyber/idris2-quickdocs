<script lang="ts">
import SearchContainer from "$lib/SearchContainer.svelte"
import { onMount } from "svelte"
import { fetchIndex } from "$lib/search"
import type { IndexEntry } from "$lib/search"
import { base } from "$app/paths"
import { goto, afterNavigate } from "$app/navigation"
import { page } from "$app/stores"
import { browser } from "$app/env";

let data: Promise<IndexEntry[]> = fetchIndex("data/index.json")
let selected: IndexEntry | undefined = undefined
let viewing : string
$: viewing = base + "/data/" +  (selected?.target || "home.html")

let name: string|undefined, namespace: string|undefined

let elSearch : SearchContainer | undefined

// after history back:
$: {
  if (elSearch) {
    // requestAnimationFrame(() => {
      // elSearch.getSelectedFromURL($page.url)
      // elSearch.resetScroll()
    // })
  }
}

$: {
  if (browser) {
    const url = new URL($page.url)
    url.searchParams.set('id', name)
    url.searchParams.set('ns', namespace)
    goto(url.toString())
  }
}

afterNavigate(({to}) => {
  name = to.searchParams.get("id") || undefined
  namespace = to.searchParams.get("ns") || undefined
})

// export function setURLFromSelected(replaceState=true) {
//   if (selected) {
//     const url = new URL($page.url)
//     url.searchParams.set('id', selected.name)
//     url.searchParams.set('ns', selected.namespace)
//     if (url.toString() != $page.url.toString()) {
//       console.log("aaa", url.toString(), $page.url.toString())
//       goto(url.toString(), {
//         replaceState,
//       })
//     }
//   }
// }
</script>

<div class="flex-container">
  <div id="sidebar">
    <noscript>
      <div>Is JavaScript enabled?</div>
    </noscript>
    {#await data}
      <div>Loading</div>
    {:then data}
      <SearchContainer data="{data}" bind:selected bind:name bind:namespace bind:this={elSearch} />
    {/await}
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

/* article.copy {
  margin: 3em auto;
  width: 680px;
}
article.copy code {
   background-color: #eeeeee;
   border: 1px solid #dddddd;
   border-radius: 2px;
   padding: 1px 0.4em;
 }

@media(max-width: 720px) {
  article.copy {
    margin: 3em 1em;
    width: auto;
  }
} */

:global {
  html, body {
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
