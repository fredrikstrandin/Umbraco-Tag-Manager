import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/index.ts',
			formats: ['es'],
			fileName: 'tagmanager',
		},
		outDir: '../wwwroot/App_Plugins/TagManager',
		emptyOutDir: true,
		sourcemap: true,
		rollupOptions: {
			external: [/^@umbraco/],
		},
	},
	base: '/App_Plugins/TagManager/',
});

