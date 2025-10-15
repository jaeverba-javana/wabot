<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useField, useForm } from 'vee-validate'
// @ts-ignore Working
import { axiosApi } from '@Utils/axios.ts'
import {useRouter} from "vue-router";

export default defineComponent({
  name: "SignUpAuthComponent",
  setup() {
    const isLoading = ref(false);
    const router = useRouter()

    const { handleSubmit } = useForm({
      validationSchema: {
        email(value: string) {
          if (!value)
            return 'Campo vacío'

          if (!(/^[\w-+%]([\w-+%.](?!\.{2}))+[\w-+%]@([^-][-a-z]+[^-]\.)?([^-][-a-z]+[^-])(\.[a-z]{2,}){1,2}$/.test(value)))
            return 'Email inválido'

          return true
        },
        password(value: string) {
          if (!value)
            return 'Campo vacío'

          if (value.length < 8)
            return 'Contraseña demasiado corta'

          return true
        },
        // @ts-ignore
        passwordConfirmation(value: string, { form }) {
          if (!value)
            return 'Campo vacío'

          if (value !== form.password)
            return 'Las contraseñas no coinciden'

          return true
        }
      },

      initialTouched: {
        email: true,
        password: false,
        passwordConfirmation: false
      }
    })

    const labels = {
      email: useField('email'),
      password: useField('password'),
      passwordConfirmation: useField('passwordConfirmation'),
    }

    const onSubmit = handleSubmit(() => {
      isLoading.value = true

      axiosApi.post('/auth/register', {
        data: {
          email: labels.email.value.value,
          password: labels.password.value.value
        }
      }).then((r: any) => {
        isLoading.value = false

        if (r.status === 200) {
          router.replace('/console')
        }

      }).catch((r: any) => {
        isLoading.value = false
        if (r.status === 500) {
          const reason = r.response.data.reason
          if (reason.code === 11000) {
            console.log(reason);
            // @ts-ignore
            labels[reason.labels[0]].setErrors("Un usuario ya escribió esto")

          }
        }
      })
    })

    const isAllCorrect = computed(() => {
      return !labels.email.errors.value.length && labels.email.value.value
        && !labels.password.errors.value.length && labels.password.value.value
        && !labels.passwordConfirmation.errors.value.length && labels.passwordConfirmation.value.value
    })

    return {
      ...labels,
      onSubmit,
      isLoading, isAllCorrect,
    }
  }
})
</script>

<template>
  <VForm :disabled="isLoading" @submit.prevent="onSubmit">
    <VContainer>
      <div class="labels">
        <div class="wrapper">
          <VTextField label="Correo electr&oacute;nico" type="email" v-model="email.value.value"
            :error-messages="email.errorMessage.value" autofocus />

          <VTextField label="Contrase&ntilde;a" type="password" v-model="password.value.value"
            :error-messages="password.errorMessage.value" />

          <VTextField label="Confirmar contrase&ntilde;a" type="password" v-model="passwordConfirmation.value.value"
            :error-messages="passwordConfirmation.errorMessage.value" />
        </div>
      </div>

      <VBtn type="submit" :disabled="isLoading || !isAllCorrect" :loading="isLoading" text="Registrarse" />
    </VContainer>
  </VForm>
</template>

<style scoped>
.v-form {
  height: 100%;

  .v-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .labels {
      flex: 1;
      margin-bottom: 2em;


      >.wrapper {
        display: flex;
        flex-direction: column;
        justify-content: start;

        row-gap: 1em;
      }
    }
  }
}
</style>