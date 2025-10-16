<template>
	<div class="toast-wrapper" aria-live="polite" aria-atomic="true">
		<transition name="toast-fade" mode="out-in">
			<div v-if="toast" :key="toast.id" class="toast"
					 :class="`toast--${toast.variant}`" role="status">
				<span class="toast__message">{{ toast.message }}</span>
				<button class="toast__close" @click="dismiss" aria-label="Cerrar">×
				</button>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {useToastStore} from '@/stores/toast.store.ts'

const toastStore = useToastStore()
const {current: toast} = storeToRefs(toastStore)
const {dismiss} = toastStore
</script>

<style scoped>
.toast-wrapper {
	position: fixed;
	left: 16px;
	bottom: 16px;
	z-index: 9999;
	pointer-events: none;
}

.toast {
	min-width: 260px;
	max-width: 420px;
	box-shadow: var(--elevation4);
	border-radius: 8px;
	padding: 12px 40px 12px 12px;
	color: var(--toast-text, #fff);
	background: var(--toast-background, #0b141a);
	pointer-events: auto;
}

.toast__message {
	display: inline-block;
}

.toast__close {
	position: absolute;
	right: 8px;
	top: 6px;
	border: none;
	background: transparent;
	color: inherit;
	font-size: 20px;
	cursor: pointer;
}

.toast--success {
	background: #1b5e20;
}

.toast--info {
	background: #0b141a;
}

.toast--warning {
	background: #b26a00;
}

.toast--error {
	background: #b71c1c;
}

.toast-fade-enter-active, .toast-fade-leave-active {
	transition: opacity .2s,
	transform .2s, var(--elevation-transition);
}

.toast-fade-enter-from, .toast-fade-leave-to {
	opacity: 0;
	transform: translateY(8px);
	box-shadow: var(--elevation0);
}
</style>
