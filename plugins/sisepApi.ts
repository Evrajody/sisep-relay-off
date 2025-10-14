export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

    const { data: authUser } = useAuth();

    const sisepApi = $fetch.create({
        baseURL: secret.sisebApiBaseUrl,
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${authUser.value?.access_token}`
        },
    })

    return {
        provide: {
            sisepApi
        }
    }
})