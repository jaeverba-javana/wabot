import {defineStore} from 'pinia'
import {Ref, ref} from "vue";
import {axiosApi} from "../utils/axios.ts";

interface User {
    email: string
}

export const useAppStore = defineStore("app", () => {
    const user: Ref<undefined, User> = ref(undefined)

    axiosApi.get('/user')
        .then(({data}) => {
            user.value = data.message
        }).catch(reason => console.error(reason))

    return {user}
})