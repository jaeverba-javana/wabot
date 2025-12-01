import {defineStore} from "pinia";

export const useEventStore = (storeName: string) => defineStore(`${storeName}.events`, () => {
	const eventTypes: string[] = [] as const
	type EventType = typeof eventTypes[number]
	type EventHandler = (payload?: unknown) => void

	const events: Record<EventType, EventHandler[]> = Object.fromEntries(
		eventTypes.map(type => [type, []])
	) as Record<EventType, EventHandler[]>

	function emit(eventType: EventType, payload?: unknown) {
		if (events[eventType]) {
			events[eventType].forEach(handler => {
				console.log("emitiendo")
				handler(payload)
			})
		}
	}

	function on(eventType: EventType, handler: EventHandler) {
		if (events[eventType]) {
			console.log(eventType, "existe")
			events[eventType].push(handler)
		} else {
			console.log(eventType, "no existe")
		}
	}

	function off(eventType: EventType, handler: EventHandler) {
		if (events[eventType]) {
			const index = events[eventType].indexOf(handler)
			if (index > -1) {
				events[eventType].splice(index, 1)
			}
		}
	}

	function declareEvent(eventType: EventType) {
		if (!events[eventType]) {
			events[eventType] = []
		}
	}

	return {
		emit,
		on,
		off,
		declareEvent
	}
})()
