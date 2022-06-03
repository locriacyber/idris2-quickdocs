/** search - input element */

<script lang="ts">
	export let value: string = ""
</script>

<div class="container">
  <input
    type="text"
    placeholder="Type to begin searching"
    bind:value="{value}"
  />
  <span class="key-shortcut">Tab ⇥</span>
</div>

<style lang="scss">
.container {
  width: 100%;
  height: 31px;
  flex-shrink: 0;
  background-color: rgb(37, 37, 37);
  /*border-bottom: 3px solid rgb(101, 159, 219);*/
  display: flex;
  flex-direction: row;
  position: relative;

	&:hover .key-shortcut {
		opacity: 0;
	}
}

input {
  width: 100%;
	&:focus + .key-shortcut {
		opacity: 0;
	}
}

.key-shortcut {
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
</style>
