import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/login",
	},
	{
		path: "/login",
		name: "loginpage",
		component: async () => await import("../views/LoginView.vue"),
	},
	{
		path: "/chat",
		redirect: "/chat/hall",
		name: "chatpage",
		component: async () => await import("../views/MainView.vue"),
		// 必须登录才能访问
		meta: {
			requiresAuth: true,
		},
		children: [
			{
				path: "/chat/hall",
				name: "hallpage",
				component: async () => await import("../views/HallView.vue"),
			},
			{
				path: "/chat/contacts",
				name: "contactspage",
				component: async () => await import("../views/ContactsView.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach((to, from, next) => {
	const isAuthenticated = sessionStorage.getItem("username");
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!isAuthenticated) {
			next("/");
		} else {
			next();
		}
	} else next();
});

export default router;
