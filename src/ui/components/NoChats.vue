<script lang="ts">

export default {
	name: "NoChats"
}
</script>

<template>
	<div class="no-chats-container">
		<img src="/img/svg/empty.svg" alt="No chats" class="no-chats-image">
		<h2 class="no-chats-message">Oops! A&uacute;n no hay chats.</h2>
<!--		<p class="no-chats-subtitle">Start a new conversation to begin chatting</p>-->
	</div>
</template>

<style scoped>
.no-chats-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	height: 100%;
	text-align: center;
}

.no-chats-image {
	width: 200px;
	height: 200px;
	margin-bottom: 2rem;
	opacity: 0.8;
}

.no-chats-message {
	font-size: 1.5rem;
	margin-bottom: 1rem;
	color: var(--color-text-primary);
}

.no-chats-subtitle {
	font-size: 1rem;
	color: var(--color-text-secondary);
}
</style>