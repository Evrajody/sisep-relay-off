import type { UserSession } from "~/types/auth";
import { AbilityManager } from "~/shared/utils/abilities";

export default defineNuxtPlugin({
    name: "authorization-resolver",
    parallel: true,
    setup() {

        const { signOut, status, data: authUserSession } = useAuth();

        // Créer une instance réactive de l'AbilityManager
        const abilityManager = computed(
            () => new AbilityManager(authUserSession.value as UserSession | null)
        );

        return {
            provide: {
                authorization: {
                    /**
                     * Résout la session utilisateur actuelle
                     */
                    resolveClientUser: () => authUserSession.value as UserSession | null,

                    /**
                     * Retourne l'instance de l'AbilityManager pour l'utilisateur actuel
                     */
                    getAbilityManager: () => abilityManager.value,

                    /**
                     * Vérifie si l'utilisateur peut effectuer une action
                     */
                    can: (action: string, subject: string) => {
                        return abilityManager.value.can(action as any, subject as any);
                    },

                    /**
                     * Vérifie si l'utilisateur ne peut pas effectuer une action
                     */
                    cannot: (action: string, subject: string) => {
                        return abilityManager.value.cannot(action as any, subject as any);
                    },
                },
            },
        };
    },
});
