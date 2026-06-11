import { defineConfig } from 'vite';

export default defineConfig({
	base: './',
	server: {
		allowedHosts: ['lived-sit-maple-samuel.trycloudflare.com'],
	},
});

