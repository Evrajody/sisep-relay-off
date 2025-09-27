export default defineNuxtPlugin((nuxtApp) => {

    const { public: secret  } = useRuntimeConfig()

    const sisepApi = $fetch.create({

        baseURL: secret.sisebApiBaseUrl,
        responseType: "json",
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        onResponse: ({response}) => {
            // console.log(response)

            if (response.status === 201 || response.status === 200) {
                alert('Opération effectuée avec succès')
            }

            if (response.status === 400) {
                alert('Opération echouée')
            }
        },

        onError: ({error}) => {
            alert(error)
            console.log(error)
        }
    })

    return {
        provide: {
            sisepApi
        }
    }
})