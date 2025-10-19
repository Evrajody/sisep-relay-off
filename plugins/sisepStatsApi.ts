export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

   // const { data: authUser } = useAuth();

    const sisepStatsApi = $fetch.create({
        baseURL: secret.sisebApiStatsUrl,
        headers: {
            'Content-Type': 'application/json',
           // 'authorization': `Bearer ${authUser.value?.access_token}`
        },
    })

    return {
        provide: {
            sisepStatsApi
        }
    }
})