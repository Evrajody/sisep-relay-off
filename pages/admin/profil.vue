<script lang="ts" setup>

import { ref, computed, onMounted, onUnmounted } from 'vue';

definePageMeta({
  layout: "sisep-app-layout",
  middleware: ["auth"],
});

useHead({
  title: "Mon profil",
});

// Récupérer la session de l'utilisateur connecté
const {$authClient} = useNuxtApp();
const { data: session, error } = await $authClient.getSession();

// Computed properties pour extraire les informations de la session
const userFullName = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.userFullName || session?.user?.name || '';
});

const userName = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.username || '';
});

const userEmail = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.userEmail || session?.user?.email || '';
});

const userModules = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.liste_modules || [];
});

const userStructures = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.structures_modules || [];
});

const userResources = computed(() => {
  return session?.session?.additional_info?.tokenDetails?.userResources || {};
});

const allUserRoles = computed(() => {
  const resources = userResources.value;
  const allRoles: string[] = [];
  Object.values(resources).forEach((module: any) => {
    if (module.roles) {
      allRoles.push(...module.roles);
    }
  });
  return [...new Set(allRoles)]; // Remove duplicates
});

const primaryRole = computed(() => {

  const roles = allUserRoles.value;
  if (roles.length === 0) return 'Utilisateur';

  // Prioriser certains rôles
  if (roles.includes('ADMIN')) return 'Administrateur';
  if (roles.includes('POINT_FOCAL')) return 'Point Focal';
  if (roles.includes('VALIDATEUR')) return 'Validateur';

  // Sinon retourner le premier rôle formaté
  return roles[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
});

// Données utilisateur
const user = ref({
  nom: userFullName.value.split(' ').pop() || '',
  prenoms: userFullName.value.split(' ').slice(0, -1).join(' ') || userFullName.value,
  email: userEmail.value,
  tel: '',
  role: primaryRole.value,
  avatar: null,
  dateCreation: session?.user?.createdAt || new Date().toISOString(),
  derniereConnexion: new Date().toLocaleString('fr-FR'),
  structure: userStructures.value[0] || '',
  fonction: '',
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

// Compte à rebours pour l'expiration du token
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
});

const updateCountdown = () => {
  const expiresAt = session?.session?.additional_info?.accessTokenExpiresAt;
  if (!expiresAt) {
    countdown.value.expired = true;
    return;
  }

  const now = new Date().getTime();
  const expiry = new Date(expiresAt).getTime();
  const distance = expiry - now;

  if (distance < 0) {
    countdown.value.expired = true;
    countdown.value.days = 0;
    countdown.value.hours = 0;
    countdown.value.minutes = 0;
    countdown.value.seconds = 0;
    return;
  }

  countdown.value.expired = false;
  countdown.value.days = Math.floor(distance / (1000 * 60 * 60 * 24));
  countdown.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  countdown.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  countdown.value.seconds = Math.floor((distance % (1000 * 60)) / 1000);
};

// Mettre à jour le compte à rebours toutes les secondes
let countdownInterval: NodeJS.Timeout | null = null;

onMounted(() => {
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
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
            <div class="flex items-center gap-2 mt-1">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ user.email }}
              </p>
              <UBadge
                v-if="session?.user?.emailVerified"
                color="green"
                variant="subtle"
                size="xs"
              >
                <UIcon name="i-heroicons-check-circle" class="w-3 h-3" />
                Vérifié
              </UBadge>
              <UBadge
                v-else
                color="yellow"
                variant="subtle"
                size="xs"
              >
                <UIcon name="i-heroicons-exclamation-circle" class="w-3 h-3" />
                Non vérifié
              </UBadge>
            </div>
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
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                      <UIcon name="i-heroicons-computer-desktop" class="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 dark:text-white">Session actuelle</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {{ session?.userAgent }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          IP: {{ session?.ipAddress }}
                        </p>
                        <p class="text-xs text-gray-500">
                          Créée le: {{ new Date(session?.createdAt || new Date()).toLocaleString('fr-FR') }}
                        </p>
                        <p class="text-xs text-gray-500">
                          Expire le: {{ new Date(session?.expiresAt || new Date()).toLocaleString('fr-FR') }}
                        </p>
                      </div>
                    </div>
                    <UBadge color="green" variant="subtle" size="xs" class="flex-shrink-0">
                      Actif
                    </UBadge>
                  </div>

                  <!-- Compte à rebours du token -->
                  <div v-if="session?.session.additional_info?.accessTokenExpiresAt" class="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <p class="text-sm font-semibold text-gray-900 dark:text-white">Temps restant du token</p>
                      </div>
                    </div>

                    <!-- Expiration message -->
                    <div v-if="countdown.expired" class="text-center py-2">
                      <UBadge color="red" variant="solid" size="lg">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                        Token expiré
                      </UBadge>
                      <p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Veuillez vous reconnecter
                      </p>
                    </div>

                    <!-- Countdown display -->
                    <div v-else class="grid grid-cols-4 gap-2">
                      <!-- Jours -->
                      <div class="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {{ countdown.days }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          jour{{ countdown.days > 1 ? 's' : '' }}
                        </span>
                      </div>

                      <!-- Heures -->
                      <div class="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {{ countdown.hours }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          heure{{ countdown.hours > 1 ? 's' : '' }}
                        </span>
                      </div>

                      <!-- Minutes -->
                      <div class="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                          {{ countdown.minutes }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          min
                        </span>
                      </div>

                      <!-- Secondes -->
                      <div class="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <span class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {{ countdown.seconds }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          sec
                        </span>
                      </div>
                    </div>

                    <p class="text-xs text-center text-gray-600 dark:text-gray-400 mt-3">
                      Expiration: {{ new Date(session?.session?.additional_info?.accessTokenExpiresAt).toLocaleString('fr-FR') }}
                    </p>
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
          <!-- Modules et Accès -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Modules et Accès
              </h3>
            </template>

            <!-- Empty state si aucune information disponible -->
            <div
              v-if="!userName && userModules.length === 0 && userStructures.length === 0"
              class="flex flex-col items-center justify-center py-8 text-center"
            >
              <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                <UIcon name="i-heroicons-inbox" class="w-8 h-8 text-gray-400" />
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Aucune information disponible</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Les informations d'accès ne sont pas configurées
              </p>
            </div>

            <!-- Contenu normal -->
            <div v-else class="space-y-4">
              <!-- Nom d'utilisateur -->
              <div v-if="userName" class="space-y-1">
                <p class="text-xs text-gray-500 dark:text-gray-400">Nom d'utilisateur</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userName }}</p>
              </div>

              <UDivider v-if="userName && (userModules.length > 0 || userStructures.length > 0)" />

              <!-- Modules accessibles -->
              <div v-if="userModules.length > 0" class="space-y-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Modules accessibles</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="module in userModules"
                    :key="module"
                    color="blue"
                    variant="subtle"
                    size="sm"
                  >
                    {{ module }}
                  </UBadge>
                </div>
              </div>

              <UDivider v-if="userModules.length > 0 && userStructures.length > 0" />

              <!-- Structures -->
              <div v-if="userStructures.length > 0" class="space-y-2">
                <p class="text-xs text-gray-500 dark:text-gray-400">Structures</p>
                <div class="space-y-1">
                  <div
                    v-for="(structure, index) in userStructures"
                    :key="index"
                    class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-blue-600" />
                    <span>{{ structure }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Rôles et Permissions -->
          <UCard v-if="Object.keys(userResources).length > 0">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Rôles et Permissions
              </h3>
            </template>

            <div class="space-y-4">
              <div
                v-for="(resource, moduleName) in userResources"
                :key="moduleName"
                class="space-y-2"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-purple-600" />
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ moduleName }}</p>
                </div>
                <div class="flex flex-wrap gap-1.5 ml-6">
                  <UBadge
                    v-for="role in resource.roles"
                    :key="role"
                    color="purple"
                    variant="soft"
                    size="xs"
                  >
                    {{ role.replace(/_/g, ' ') }}
                  </UBadge>
                </div>
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
              <div class="space-y-1">
                <span class="text-xs text-gray-500 dark:text-gray-400">ID Utilisateur</span>
                <p class="font-mono text-xs text-gray-900 dark:text-white break-all">
                  {{ session?.user?.id }}
                </p>
              </div>

              <UDivider />

              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Membre depuis</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ new Date(session?.user?.createdAt || new Date()).toLocaleDateString('fr-FR') }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Dernière mise à jour</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ new Date(session?.user?.updatedAt || new Date()).toLocaleDateString('fr-FR') }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Fournisseur d'auth</span>
                <UBadge
                  :color="session?.auth_provider === 'keycloak' ? 'blue' : 'gray'"
                  variant="subtle"
                  size="xs"
                >
                  {{ session?.auth_provider || 'N/A' }}
                </UBadge>
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
