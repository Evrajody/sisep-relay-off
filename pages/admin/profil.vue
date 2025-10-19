<script lang="ts" setup>

import { ref, computed } from 'vue';

definePageMeta({
  layout: "sisep-app-layout",
});

useHead({
  title: "Mon profil",
});

// Données utilisateur (à remplacer par les vraies données)
const user = ref({
  nom: 'DOSSAVI',
  prenoms: 'Hubert',
  email: 'hubert.dossavi@gmail.com',
  tel: '+229 97 00 00 00',
  role: 'Administrateur',
  avatar: null,
  dateCreation: '2024-01-15',
  derniereConnexion: '2025-03-02 14:30',
  structure: 'Ministère du Cadre de Vie',
  fonction: 'Directeur Technique',
});

// Onglet actif
const activeTab = ref(0);

// Tabs de navigation
const tabs = [
  {
    key: 'informations',
    label: 'Informations personnelles',
    icon: 'i-heroicons-user',
    slot: 'informations'
  },
  {
    key: 'security',
    label: 'Sécurité',
    icon: 'i-heroicons-lock-closed',
    slot: 'security'
  },
  {
    key: 'preferences',
    label: 'Préférences',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'preferences'
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'i-heroicons-bell',
    slot: 'notifications'
  }
];

// États du formulaire
const isEditingProfile = ref(false);
const isSavingProfile = ref(false);
const isChangingPassword = ref(false);

// Formulaire informations personnelles
const profileForm = ref({
  nom: user.value.nom,
  prenoms: user.value.prenoms,
  email: user.value.email,
  tel: user.value.tel,
  fonction: user.value.fonction,
  structure: user.value.structure,
});

// Formulaire changement de mot de passe
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Préférences
const preferences = ref({
  theme: 'light',
  language: 'fr',
  emailNotifications: true,
  pushNotifications: true,
});

// Notifications
const notificationSettings = ref({
  projectUpdates: true,
  statusChanges: true,
  comments: true,
  mentions: true,
  weeklyReport: false,
  monthlyReport: true,
});

// Actions
const saveProfile = async () => {
  isSavingProfile.value = true;
  try {
    // Logique de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    user.value = { ...user.value, ...profileForm.value };
    isEditingProfile.value = false;
    // Afficher notification de succès
  } catch (error) {
    // Gérer l'erreur
  } finally {
    isSavingProfile.value = false;
  }
};

const cancelEdit = () => {
  isEditingProfile.value = false;
  profileForm.value = {
    nom: user.value.nom,
    prenoms: user.value.prenoms,
    email: user.value.email,
    tel: user.value.tel,
    fonction: user.value.fonction,
    structure: user.value.structure,
  };
};

const changePassword = async () => {
  isChangingPassword.value = true;
  try {
    // Logique de changement de mot de passe
    await new Promise(resolve => setTimeout(resolve, 1000));
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    // Afficher notification de succès
  } catch (error) {
    // Gérer l'erreur
  } finally {
    isChangingPassword.value = false;
  }
};

const savePreferences = async () => {
  try {
    // Logique de sauvegarde des préférences
    await new Promise(resolve => setTimeout(resolve, 500));
    // Afficher notification de succès
  } catch (error) {
    // Gérer l'erreur
  }
};

const saveNotificationSettings = async () => {
  try {
    // Logique de sauvegarde des paramètres de notification
    await new Promise(resolve => setTimeout(resolve, 500));
    // Afficher notification de succès
  } catch (error) {
    // Gérer l'erreur
  }
};

// Activités récentes (simulées)
const recentActivities = ref([
  {
    id: 1,
    type: 'project_created',
    title: 'Création du projet "Construction d\'écoles"',
    date: '2025-03-01 10:30',
    icon: 'i-heroicons-folder-plus',
    color: 'blue'
  },
  {
    id: 2,
    type: 'status_changed',
    title: 'Statut modifié pour "Programme eau potable"',
    date: '2025-02-28 15:20',
    icon: 'i-heroicons-arrow-path',
    color: 'green'
  },
  {
    id: 3,
    type: 'document_uploaded',
    title: 'Document ajouté à "Formation jeunes"',
    date: '2025-02-27 09:15',
    icon: 'i-heroicons-document-plus',
    color: 'purple'
  },
]);

const links = [{
  label: 'Mon profil',
  icon: 'i-heroicons-user'
}];
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900">
    <!-- En-tête -->
    <UDashboardToolbar
      :ui="{ wrapper: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800' }"
      class="py-0 px-1.5"
    >
      <UHorizontalNavigation :links="links" />
      <template #right>
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          size="sm"
          label="Retour"
          @click="$router.back()"
        />
      </template>
    </UDashboardToolbar>

    <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <!-- En-tête du profil -->
      <UCard
        :ui="{
          body: { padding: 'p-6 sm:p-8' }
        }"
      >
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <UAvatar
              :src="user.avatar"
              :alt="`${user.prenoms} ${user.nom}`"
              size="3xl"
              :ui="{ size: { '3xl': 'h-24 w-24 text-3xl' } }"
            />
            <UButton
              icon="i-heroicons-camera"
              color="primary"
              size="xs"
              class="absolute bottom-0 right-0 rounded-full"
              :ui="{ rounded: 'rounded-full' }"
            />
          </div>

          <!-- Informations principales -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ user.prenoms }} {{ user.nom }}
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ user.email }}
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-3">
              <UBadge color="blue" variant="subtle">
                {{ user.role }}
              </UBadge>
              <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-building-office-2" class="w-4 h-4" />
                <span>{{ user.structure }}</span>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-briefcase" class="w-4 h-4" />
                <span>{{ user.fonction }}</span>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-pencil-square"
              color="gray"
              variant="outline"
              @click="isEditingProfile = true; activeTab = 0"
            >
              Modifier
            </UButton>
          </div>
        </div>
      </UCard>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Onglets principaux -->
        <div class="lg:col-span-2 space-y-6">
          <UTabs :items="tabs" v-model="activeTab">
            <!-- Informations personnelles -->
            <template #informations>
              <UCard class="mt-6">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Informations personnelles
                    </h3>
                    <UButton
                      v-if="!isEditingProfile"
                      icon="i-heroicons-pencil-square"
                      color="gray"
                      variant="ghost"
                      size="sm"
                      @click="isEditingProfile = true"
                    >
                      Modifier
                    </UButton>
                  </div>
                </template>

                <div class="space-y-6">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UFormGroup label="Nom" required>
                      <UInput
                        v-model="profileForm.nom"
                        :disabled="!isEditingProfile"
                        placeholder="Votre nom"
                      />
                    </UFormGroup>

                    <UFormGroup label="Prénoms" required>
                      <UInput
                        v-model="profileForm.prenoms"
                        :disabled="!isEditingProfile"
                        placeholder="Vos prénoms"
                      />
                    </UFormGroup>

                    <UFormGroup label="Email" required>
                      <UInput
                        v-model="profileForm.email"
                        :disabled="!isEditingProfile"
                        type="email"
                        placeholder="email@example.com"
                      />
                    </UFormGroup>

                    <UFormGroup label="Téléphone" required>
                      <UInput
                        v-model="profileForm.tel"
                        :disabled="!isEditingProfile"
                        placeholder="+229 XX XX XX XX"
                      />
                    </UFormGroup>

                    <UFormGroup label="Structure">
                      <UInput
                        v-model="profileForm.structure"
                        :disabled="!isEditingProfile"
                        placeholder="Votre structure"
                      />
                    </UFormGroup>

                    <UFormGroup label="Fonction">
                      <UInput
                        v-model="profileForm.fonction"
                        :disabled="!isEditingProfile"
                        placeholder="Votre fonction"
                      />
                    </UFormGroup>
                  </div>

                  <div v-if="isEditingProfile" class="flex justify-end gap-2">
                    <UButton
                      color="gray"
                      variant="ghost"
                      @click="cancelEdit"
                    >
                      Annuler
                    </UButton>
                    <UButton
                      color="primary"
                      :loading="isSavingProfile"
                      @click="saveProfile"
                    >
                      Enregistrer
                    </UButton>
                  </div>
                </div>
              </UCard>
            </template>

            <!-- Sécurité -->
            <template #security>
              <UCard class="mt-6">
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Changer le mot de passe
                  </h3>
                </template>

                <div class="space-y-6">
                  <UFormGroup label="Mot de passe actuel" required>
                    <UInput
                      v-model="passwordForm.currentPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </UFormGroup>

                  <UFormGroup label="Nouveau mot de passe" required>
                    <UInput
                      v-model="passwordForm.newPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </UFormGroup>

                  <UFormGroup label="Confirmer le nouveau mot de passe" required>
                    <UInput
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </UFormGroup>

                  <div class="flex justify-end">
                    <UButton
                      color="primary"
                      :loading="isChangingPassword"
                      @click="changePassword"
                    >
                      Changer le mot de passe
                    </UButton>
                  </div>
                </div>
              </UCard>

              <!-- Sessions actives -->
              <UCard class="mt-6">
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Sessions actives
                  </h3>
                </template>

                <div class="space-y-4">
                  <div class="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-start gap-3">
                      <UIcon name="i-heroicons-computer-desktop" class="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">Session actuelle</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Windows • Chrome • Cotonou, Bénin
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          Dernière activité: {{ user.derniereConnexion }}
                        </p>
                      </div>
                    </div>
                    <UBadge color="green" variant="subtle" size="xs">
                      Actif
                    </UBadge>
                  </div>
                </div>
              </UCard>
            </template>

            <!-- Préférences -->
            <template #preferences>
              <UCard class="mt-6">
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Préférences de l'application
                  </h3>
                </template>

                <div class="space-y-6">
                  <UFormGroup label="Thème">
                    <USelectMenu
                      v-model="preferences.theme"
                      :options="[
                        { value: 'light', label: 'Clair' },
                        { value: 'dark', label: 'Sombre' },
                        { value: 'auto', label: 'Automatique' }
                      ]"
                      value-attribute="value"
                      option-attribute="label"
                      @update:modelValue="savePreferences"
                    />
                  </UFormGroup>

                  <UFormGroup label="Langue">
                    <USelectMenu
                      v-model="preferences.language"
                      :options="[
                        { value: 'fr', label: 'Français' },
                        { value: 'en', label: 'English' }
                      ]"
                      value-attribute="value"
                      option-attribute="label"
                      @update:modelValue="savePreferences"
                    />
                  </UFormGroup>

                  <UDivider />

                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Notifications par email
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Recevoir des notifications par email
                        </p>
                      </div>
                      <UToggle
                        v-model="preferences.emailNotifications"
                        @update:modelValue="savePreferences"
                      />
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          Notifications push
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Recevoir des notifications dans l'application
                        </p>
                      </div>
                      <UToggle
                        v-model="preferences.pushNotifications"
                        @update:modelValue="savePreferences"
                      />
                    </div>
                  </div>
                </div>
              </UCard>
            </template>

            <!-- Notifications -->
            <template #notifications>
              <UCard class="mt-6">
                <template #header>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Paramètres de notifications
                  </h3>
                </template>

                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Mises à jour de projets
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Être notifié des changements sur les projets
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.projectUpdates"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Changements de statut
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Notifications lors des changements de statut
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.statusChanges"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Commentaires
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Notifications pour les nouveaux commentaires
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.comments"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Mentions
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Être notifié quand vous êtes mentionné
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.mentions"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Rapport hebdomadaire
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Recevoir un résumé hebdomadaire par email
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.weeklyReport"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>

                  <UDivider />

                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">
                        Rapport mensuel
                      </p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Recevoir un rapport mensuel détaillé
                      </p>
                    </div>
                    <UToggle
                      v-model="notificationSettings.monthlyReport"
                      @update:modelValue="saveNotificationSettings"
                    />
                  </div>
                </div>
              </UCard>
            </template>
          </UTabs>
        </div>

        <!-- Sidebar - Informations complémentaires -->
        <div class="space-y-6">
          <!-- Statistiques -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Mes statistiques
              </h3>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <UIcon name="i-heroicons-folder" class="w-4 h-4 text-blue-600" />
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Projets créés</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white">24</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-green-600" />
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Projets terminés</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white">18</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                    <UIcon name="i-heroicons-document" class="w-4 h-4 text-purple-600" />
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">Documents</span>
                </div>
                <span class="font-semibold text-gray-900 dark:text-white">156</span>
              </div>
            </div>
          </UCard>

          <!-- Activités récentes -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Activités récentes
              </h3>
            </template>

            <div class="space-y-4">
              <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3"
              >
                <div :class="[`bg-${activity.color}-50 dark:bg-${activity.color}-950/30`, 'p-2 rounded-lg flex-shrink-0']">
                  <UIcon :name="activity.icon" :class="[`text-${activity.color}-600`, 'w-4 h-4']" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ activity.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ activity.date }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Informations compte -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Informations du compte
              </h3>
            </template>

            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Membre depuis</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ new Date(user.dateCreation).toLocaleDateString('fr-FR') }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Dernière connexion</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ user.derniereConnexion }}
                </span>
              </div>

              <UDivider />

              <UButton
                color="red"
                variant="ghost"
                size="sm"
                icon="i-heroicons-trash"
                block
              >
                Supprimer mon compte
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
