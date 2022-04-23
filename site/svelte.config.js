import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

let base_url = ""

if ("BASE_URL" in process.env) {
	base_url = process.env["BASE_URL"]
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),
	kit: {
		paths: {
			base: base_url
		},
		adapter: adapter(),
		prerender: {
			default: true
		},
	},
};

export default config;
