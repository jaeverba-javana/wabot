import {RouteRecordRaw, createRouter, createWebHistory} from "vue-router";
import HomeLayout from "@/ui/layouts/HomeLayout.vue";
import RootLayout from "@/ui/layouts/RootLayout.vue";

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'RootLayout',
		component: RootLayout,
		meta: {requiresGuest: true},
		children: [
			{
				path: '',
				name: 'Landing',
				component: () => import('@/ui/views/root/MainRootView.vue')
			}, {
			path: 'politica-privacidad',
				name: 'PolicyPrivacy',
				component: () => import('@/ui/views/root/PrivacyPolicyRootView.vue')
			}
		]
	},
	{
		path: '/auth',
		name: 'AuthLayout',
		component: () => import("@/ui/layouts/AuthLayout.vue"),
		children: [{
			path: 'login',
			name: 'Login',
			component: () => import('@/ui/views/auth/LoginAuthComponent.vue')
		}, {
			path: 'signup',
			name: 'Signup',
			component: () => import('@/ui/views/auth/SignupAuthComponent.vue')
		}]
	},
	{
		path: '/:notFound(.*)*',
		name: 'notFound',
		component: () => import('@/ui/layouts/NotFoundLayout.vue')
	},
	{
		path: '/',
		name: 'HomeLayout',
		component: HomeLayout,
		meta: {requiresAuth: true},
		children: [
			{
				path: '',
				name: 'Dashboard',
				component: () => import('@Views/ConsoleView.vue')
			},
			{
				path: 'console',
				name: 'consoleView',
				component: () => import('@Views/ConsoleView.vue')
			},
			{
				path: 'config',
				name: 'configView',
				component: () => import('@Views/ConfigView.vue')
			},
			{
				path: 'chatbot',
				name: 'chatbotView',
				component: () => import('@/ui/views/ChatbotView.vue')
			}
		]
	},
]

export default createRouter({
	routes,
	history: createWebHistory()
})
