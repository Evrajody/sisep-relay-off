<script lang="ts" setup>
definePageMeta({
    layout: "sisep-app-layout",
});

useHead({
    title: "Modifier un agent",
});

const route = useRoute();
const agentId = route.params.id as string;

const links = [
    {
        label: "Agents",
        icon: "i-heroicons-users",
        to: "/project-module/agents"
    },
    {
        label: "Modifier un agent",
        icon: "i-heroicons-pencil-square",
    },
];

const { $sisepApi } = useNuxtApp();

// Chargement de l'agent
const { data: agent, pending: isLoading } = await useAsyncData('agent-edit', () =>
    $sisepApi(`agents/${agentId}`)
);

// Formulaire agent
const formData = ref({
    firstName: agent.value?.firstName || '',
    lastName: agent.value?.lastName || '',
    email: agent.value?.email || '',
    password: '',
    confirmPassword: '',
    structureId: agent.value?.structureId || agent.value?.structure?.id || '',
    role: agent.value?.role || 'POINT_FOCAL',
    status: agent.value?.status || 'ACTIVE',
});

const isSubmitting = ref(false);

// Rôles disponibles
const roles = [
    { value: 'POINT_FOCAL', label: 'Point focal' },
    { value: 'VALIDATEUR', label: 'Validateur' },
    { value: 'SUPERVALIDATEUR', label: 'Supervalidateur' },
    { value: 'PRC', label: 'PRC' },
    { value: 'MINISTRE', label: 'Ministre' },
];

// Mise à jour de l'agent
const updateAgent = async () => {
    // Validation
    if (!formData.value.firstName || !formData.value.lastName || !formData.value.email) {
        makeAlert({
            type: "error",
            title: "OUPS ERREUR !",
            message: "Veuillez remplir tous les champs obligatoires",
            extraClass: "bg-red-500",
        });
        return;
    }

    // Validation du mot de passe si renseigné
    if (formData.value.password) {
        if (formData.value.password !== formData.value.confirmPassword) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Les mots de passe ne correspondent pas",
                extraClass: "bg-red-500",
            });
            return;
        }

        if (formData.value.password.length < 6) {
            makeAlert({
                type: "error",
                title: "OUPS ERREUR !",
                message: "Le mot de passe doit contenir au moins 6 caractères",
                extraClass: "bg-red-500",
            });
            return;
        }
    }

    isSubmitting.value = true;

    try {
        const payload: any = {
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
            email: formData.value.email,
            structureId: formData.value.structureId || null,
            role: formData.value.role,
            status: formData.value.status,
        };

        // N'inclure le mot de passe que s'il a été modifié
        if (formData.value.password) {
            payload.password = formData.value.password;
        }

        const response = await $sisepApi(`agents/${agentId}`, {
            method: 'PUT',
            body: payload
        });

        makeAlert({
            type: "success",
            title: "Agent mis à jour !",
            message: `L'agent ${formData.value.firstName} ${formData.value.lastName} a été mis à jour avec succès`,
        });

        navigateTo('/project-module/agents');
    } catch (error: any) {
        makeAlert({
            type: "error",
            title: "OUPS ERREUR !",
            message: error.data?.message || "Une erreur est survenue lors de la mise à jour de l'agent",
            extraClass: "bg-red-500",
        });
    } finally {
        isSubmitting.value = false;
    }
};

const cancelEdit = () => {
    navigateTo('/project-module/agents');
};
</script>

<template>
    <UDashboardToolbar
        :ui="{ wrapper: 'bg-white dark:bg-gray-900' }"
        class="py-0 px-1.5 overflow-x-auto"
    >
        <UHorizontalNavigation :links="links" />
        <template #right>
            <UButton
                to="/project-module/agents"
                color="gray"
                variant="ghost"
                icon="i-heroicons-arrow-left"
                label="Retour"
                size="sm"
            />
        </template>
    </UDashboardToolbar>

    <div class="max-w-4xl mx-auto px-4 py-8">
        <UCard
            v-if="!isLoading && agent"
            :ui="{
                body: { padding: 'p-6 sm:p-8' },
                header: { padding: 'px-6 py-4' }
            }"
        >
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                        <UIcon name="i-heroicons-pencil-square" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Modifier l'agent
                        </h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Modifiez les informations de {{ agent.firstName }} {{ agent.lastName }}
                        </p>
                    </div>
                </div>
            </template>

            <div class="space-y-6">
                <!-- Informations personnelles -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Nom" required>
                        <UInput
                            v-model="formData.firstName"
                            placeholder="Ex: Ahouandjinou"
                            size="lg"
                            icon="i-heroicons-user"
                        />
                    </UFormGroup>

                    <UFormGroup label="Prénoms" required>
                        <UInput
                            v-model="formData.lastName"
                            placeholder="Ex: Gildas"
                            size="lg"
                            icon="i-heroicons-user"
                        />
                    </UFormGroup>
                </div>

                <UFormGroup label="Email" required>
                    <UInput
                        v-model="formData.email"
                        type="email"
                        placeholder="Ex: gildas.ahouandjinou@example.com"
                        size="lg"
                        icon="i-heroicons-envelope"
                    />
                </UFormGroup>

                <UDivider label="Changer le mot de passe (optionnel)" />

                <UAlert
                    color="blue"
                    variant="soft"
                    icon="i-heroicons-information-circle"
                    title="Modification du mot de passe"
                    description="Laissez vide si vous ne souhaitez pas modifier le mot de passe"
                />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Nouveau mot de passe">
                        <UInput
                            v-model="formData.password"
                            type="password"
                            placeholder="••••••••"
                            size="lg"
                            icon="i-heroicons-lock-closed"
                        />
                        <template #help>
                            <span class="text-xs text-gray-500">Minimum 6 caractères</span>
                        </template>
                    </UFormGroup>

                    <UFormGroup label="Confirmer le nouveau mot de passe">
                        <UInput
                            v-model="formData.confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            size="lg"
                            icon="i-heroicons-lock-closed"
                        />
                    </UFormGroup>
                </div>

                <UDivider label="Affectation et rôle" />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Structure">
                        <USelectMenu
                            v-model="formData.structureId"
                            :options="[]"
                            placeholder="Sélectionner une structure (optionnel)"
                            size="lg"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-building-office-2" class="h-5 w-5" />
                            </template>
                        </USelectMenu>
                        <template #help>
                            <span class="text-xs text-gray-500">Optionnel - Peut être assigné ultérieurement</span>
                        </template>
                    </UFormGroup>

                    <UFormGroup label="Rôle" required>
                        <USelectMenu
                            v-model="formData.role"
                            :options="roles"
                            option-attribute="label"
                            value-attribute="value"
                            size="lg"
                        >
                            <template #leading>
                                <UIcon name="i-heroicons-user-circle" class="h-5 w-5" />
                            </template>
                        </USelectMenu>
                    </UFormGroup>
                </div>

                <UFormGroup label="Statut">
                    <USelectMenu
                        v-model="formData.status"
                        :options="[
                            { value: 'ACTIVE', label: 'Actif' },
                            { value: 'INACTIVE', label: 'Inactif' },
                        ]"
                        option-attribute="label"
                        value-attribute="value"
                        size="lg"
                    />
                </UFormGroup>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton
                        color="gray"
                        variant="ghost"
                        size="lg"
                        @click="cancelEdit"
                    >
                        Annuler
                    </UButton>
                    <UButton
                        color="primary"
                        size="lg"
                        icon="i-heroicons-check"
                        :loading="isSubmitting"
                        :disabled="isSubmitting"
                        @click="updateAgent"
                    >
                        Mettre à jour
                    </UButton>
                </div>
            </template>
        </UCard>

        <!-- Loading state -->
        <UCard v-else>
            <div class="flex items-center justify-center py-12">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
            </div>
        </UCard>
    </div>
</template>

<style scoped></style>
