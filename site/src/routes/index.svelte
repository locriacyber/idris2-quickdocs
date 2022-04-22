<style>
	@import "../style.css";
</style>

<div class="flex-container">
  <div id="sidebar">
    <div class="searchbox-container">
      <input
        type="text"
        class="searchbox"
        id="i2d_searchbox"
        placeholder="Type to begin searching"
      />
      <span class="key-shortcut">Tab ⇥</span>
    </div>
    <ul id="i2d_search_results"></ul>
  </div>
  <div id="content">
    <iframe style="width: 100%; height: 100%;" src="data/home.html"> </iframe>
  </div>
</div>
