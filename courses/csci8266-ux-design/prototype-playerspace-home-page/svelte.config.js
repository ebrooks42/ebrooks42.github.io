import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			pages: '../prototypes/player-space-home-page',
			assets: '../prototypes/player-space-home-page'
		}),
		paths: {
			base: '/courses/csci8266-ux-design/prototypes/player-space-home-page'
		},
		prerender: {
			crawl: true,
			concurrency: 1
		}
	}
};

export default config;
