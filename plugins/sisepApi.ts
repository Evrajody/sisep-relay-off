export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

    const sisepApi = $fetch.create({

        baseURL: secret.sisebApiBaseUrl,
        responseType: "json",
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        onResponse: (response) => {
            // console.log(response)
        }
    })

    return {
        provide: {
            sisepApi
        }
    }
})