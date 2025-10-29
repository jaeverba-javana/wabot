<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {useField, useForm} from "vee-validate";
import { axiosApi } from '../../../utils/axios';
import { useRouter } from 'vue-router';
import {useToastStore} from "../../../stores/toast.store.ts";



export default defineComponent({
  name: "LoginAuthComponent",
  setup() {
    const router = useRouter()
    const isLoading = ref(false);

    const {handleSubmit} = useForm({
      validationSchema: {
        email(value: string) {
          if(!value)
            return 'Campo vacío'

          if(!(/^[\w-+%]([\w-+%.](?!\.{2}))+[\w-+%]@([^-][-a-z]+[^-]\.)?([^-][-a-z]+[^-])(\.[a-z]{2,}){1,2}$/.test(value)))
            return 'Email inválido'

          return true
        },
        password(value: string) {
          if(!value)
            return 'Campo vacío'

          if(value.length < 8)
            return 'Contraseña demasiado corta'

          return true
        }
      }
    })

    const email = useField('email')
    const password = useField('password')

    const onSubmit = handleSubmit(values => {
      isLoading.value = true

      axiosApi.post('/auth/login', {
        email: email.value.value,
        password: password.value.value
      }).then((r: any) => {
        isLoading.value = false
        
        if (r.status === 200) {
          router.replace('/console')
        }
        
      }).catch((r: any) => {
        isLoading.value = false
				useToastStore().show("Correo o contraseña incorrecto", 'error')
				console.log(r)
      })

      // email.value.value = ''
      // password.value.value = ''
    })

    const isAllCorrect = computed(() => {
      // console.log(email.errors.value.length && password.errors.value.length)
      // console.log(email.value.value || password.value.value)

      return !email.errors.value.length && !password.errors.value.length
        && email.value.value && password.value.value
    })

    return {
      email,
      password,
      handleSubmit,
      isLoading,
      isAllCorrect,
      onSubmit
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
        </div>


      </div>

      <VBtn
       :disabled="isLoading || !isAllCorrect"
        type="submit"
         :loading="isLoading" 
         text="Iniciar sesi&oacute;n"
         />
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

				padding: 4rem 0;
      }
    }
  }
}
</style>