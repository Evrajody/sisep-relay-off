export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

    const sisepStatsApi = $fetch.create({
        baseURL: secret.sisebApiStatsUrl,
        headers: { 'Content-Type': 'application/json' },
    })

    return {
        provide: {
            sisepStatsApi
        }
    }
})