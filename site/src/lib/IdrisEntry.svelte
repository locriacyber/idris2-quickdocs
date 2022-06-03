<script lang="ts">
	import type { IndexEntry } from "$lib/search"
	export let selected = false
	export let entry: IndexEntry
</script>

<div
	class="indexentry"
	class:selected="{selected}"
	on:click
>
	<div class="name">{entry.name}</div>
	<div>
		<span class="namespace dimmed">{entry.namespace}</span>
		<span class="package dimmed">[{entry.package}]</span>
	</div>
</div>

<style lang="scss">
	.indexentry {
		position: relative;

		> * {
			/* display: block; */
			padding: 4px;
			background-color: inherit;

			color: #000;
			text-decoration: none;
		}


		&:hover {
			background-color: #eee;
		}
	}

	.package {
		float: right;
		text-align: right;
		font-size: 85%;
	}

	.name {
		color: #000;
		font-family: Mensch, Menlo, "DejaVu Sans Mono", monospace;
		background-color: inherit;
	}

	.dimmed {
		color: #999;
	}

	.selected,
	.selected:hover {
		background-color: rgb(101, 159, 219);
	}
	.selected .dimmed {
		color: rgb(50, 80, 109);
	}
</style>