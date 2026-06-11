import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss()],
	base: './',
	server: {
		allowedHosts: ['lived-sit-maple-samuel.trycloudflare.com'],
	},
});

