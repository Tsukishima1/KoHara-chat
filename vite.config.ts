import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { TDesignResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		eslintPlugin({
			include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
		}),
		AutoImport({
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue$/,
				/\.vue\?vue/, // .vue
				/\.md$/, // .md
			],
			imports: ["vue", "vue-router"],
			dts: "./auto-imports.d.ts",
			resolvers: [
				TDesignResolver({
					library: "vue-next",
				}),
			],
		}),
		Components({
			resolvers: [
				TDesignResolver({
					library: "vue-next",
				}),
			],
		}),
	],
	resolve: {
		// 配置路径别名
		alias: {
			"@": "/src",
		},
	},
	css: {
		preprocessorOptions: {
			scss: {},
		},
	},
});
