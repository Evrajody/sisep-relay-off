import { createAuthClient } from "better-auth/client"
import { ssoClient } from "@better-auth/sso/client"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "~/server/utils/auth"

export default defineNuxtPlugin((nuxtApp) => {

    const config = useRuntimeConfig()

    const authClient = createAuthClient({
        baseURL: `${config.public.betterAuthUrl}`,
        plugins: [
            ssoClient(),
            inferAdditionalFields<typeof auth>()
        ]
    })

    return {
        provide: {
            authClient
        }
    }
})