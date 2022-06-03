<script lang="ts">
	export let items: Array<string> = []
	/**
	 * if null, then don't filter
	*/
	export let value: Array<string> = []
	export let enabled = false
	$: enabled = value.length > 0
</script>

{#if items.length == 0}
  No package loaded
{:else}
  <div class="flex">
    {#each items as package_name}
      <div class="package-choice">
        <input
          type="checkbox"
          bind:group="{value}"
          value="{package_name}"
        />{package_name}
      </div>
    {/each}
  </div>
{/if}

<style lang="scss">
	.flex {
		display: flex;
		flex-wrap: wrap;
	}
	.package-choice {
		white-space: nowrap;
	}
</style>
