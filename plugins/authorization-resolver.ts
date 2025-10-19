export default defineNuxtPlugin({
    name: "authorization-resolver",
    parallel: true,
    async setup() {

        const {$authClient} = useNuxtApp();
        const {data: authUser} = await $authClient.getSession();

        return {
            provide: {
                authorization: {
                    resolveClientUser: () =>  authUser?.session,
                },
            },
        };
    },
});
