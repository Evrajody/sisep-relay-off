export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

    const sisepApi = $fetch.create({
        baseURL: secret.sisebApiBaseUrl,
        headers: { 'Content-Type': 'application/json' },
    })

    return {
        provide: {
            sisepApi
        }
    }
})