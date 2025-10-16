import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

export const useToastStore = defineStore('toast', () => {
  const queue = ref<ToastItem[]>([])
  const current = ref<ToastItem | null>(null)
  const isShowing = computed(() => current.value !== null)
  let timer: number | null = null
  const DURATION_MS = 3000
  let idSeq = 1

  function clearTimer() {
    if (timer !== null) {
      window.clearTimeout(timer)
      timer = null
    }
  }

  function _processNext() {
    if (current.value || queue.value.length === 0) return
    current.value = queue.value.shift() || null
    if (current.value) {
      clearTimer()
      timer = window.setTimeout(() => {
        dismiss()
      }, DURATION_MS)
    }
  }

  function show(message: string, variant: ToastVariant = 'info') {
    queue.value.push({ id: idSeq++, message, variant })
    _processNext()
  }

  function dismiss() {
    clearTimer()
    current.value = null
    _processNext()
  }

  return { queue, current, isShowing, show, dismiss }
})
