<script lang="ts">
import {defineComponent} from 'vue'

export default {
	name: "MessageDetailNodeEditor",
	props: ['detail']
}
</script>

<template>
	<VTextField
			label="Header"
			type="text"
			v-model="detail['message.header'].value.value"
			:errorMessages="detail['message.header'].errors.value"/>

	<VTextarea
			label="Mensaje"
			v-model="detail['message.text'].value.value"
			:errorMessages="detail['message.text'].errors.value"/>
</template>

<style scoped>

</style>