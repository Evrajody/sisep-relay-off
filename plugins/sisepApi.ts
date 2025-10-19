export default defineNuxtPlugin( async (nuxtApp) => {

    const {$authClient} = useNuxtApp();
    const {public: secret} = useRuntimeConfig()
    const {data: authUser} = await $authClient.getSession();

    let token_call: string = `Bearer ${authUser?.session?.access_token}`

    const sisepApi = $fetch.create({
        baseURL: secret.sisebApiBaseUrl,
        headers: {
            ContentType: 'application/json',
            authorization: token_call || '',
        },
    })

    return {
        provide: {
            sisepApi
        }
    }
})