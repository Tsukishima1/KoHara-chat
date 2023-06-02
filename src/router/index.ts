import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "loginpage",
		component: async () => await import("../views/LoginView.vue"),
	},
	{
		path: "/chat",
		name: "chatpage",
		component: async () => await import("../views/MainView.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
