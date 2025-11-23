export default defineNuxtPlugin(async (nuxtApp) => {

    const {$authClient} = useNuxtApp();
    const {public: secret} = useRuntimeConfig()
    const {data: authUser} = await $authClient.getSession();

    let token_call: string = `Bearer ${authUser?.session?.access_token}`

    const sisepActiviteApi = $fetch.create({
        baseURL: secret.sisebApiActiviteUrl,
        headers: {
            ContentType: 'application/json',
            authorization: token_call || '',
        },
    })

    return {
        provide: {
            sisepActiviteApi
        }
    }
})