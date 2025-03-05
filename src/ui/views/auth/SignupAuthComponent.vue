<script lang="ts">
import {defineComponent, ref, computed} from 'vue'
import {useField, useForm} from 'vee-validate'

export default defineComponent({
  name: "SignUpAuthComponent",
  setup() {
    const isLoading = ref(false);

    const {handleSubmit} = useForm({
      validationSchema: {
        email(value: string) {
          if(!value)
            return 'Campo vacío'

          if(!(/^[^.]([\w-+%.](?!\.{2}))+[^.]@([^-][-a-z]+[^-]\.)?([^-][-a-z]+[^-])(\.[a-z]{2,}){1,2}$/.test(value)))
            return 'Email inválido'

          return true
        },
        password(value: string) {
          if(!value)
            return 'Campo vacío'

          if(value.length < 8)
            return 'Contraseña demasiado corta'

          return true
        },
        passwordConfirmation(value: string, {form}) {
          if(!value)
            return 'Campo vacío'

          if(value !== form.password)
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

    const onSubmit = handleSubmit(values => {
      isLoading.value = true
    })

    const email = useField('email')
    const password = useField('password')
    const passwordConfirmation = useField('passwordConfirmation')

    const isAllCorrect = computed(() => {
      return !email.errors.value.legth && email.value.value
       && !password.errors.value.length && password.value.value
       && !passwordConfirmation.errors.value.length && passwordConfirmation.value.value
    })

    return{
      email, password, passwordConfirmation,
      handleSubmit, onSubmit,
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
          <VTextField
              label="Correo electr&oacute;nico"
              type="email"
              v-model="email.value.value"
              :error-messages="email.errorMessage.value"
              autofocus
           />

           <VTextField
              label="Contrase&ntilde;a"
              type="password"
              v-model="password.value.value"
              :error-messages="password.errorMessage.value"
              />

            <VTextField
              label="Confirmar contrase&ntilde;a"
              type="password"
              v-model="passwordConfirmation.value.value"
              :error-messages="passwordConfirmation.errorMessage.value"
              />
        </div>
      </div>

      <VBtn
        type="submit"
        :disabled="isLoading || !isAllCorrect"
        :loading="isLoading"
        text="Registrarse"/>
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


      > .wrapper {
        display: flex;
        flex-direction: column;
        justify-content: start;

        row-gap: 1em;
      }
    }
  }
}
</style>