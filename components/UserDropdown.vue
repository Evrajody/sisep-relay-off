<script setup lang="ts">
import type { PropType } from 'vue';

// const { data: session, status, signOut } = useAuth();

// Import du composable de déconnexion
const { logout  } = useAuthLogout();
const {$authClient} = useNuxtApp();
const { data: session, error  } = await $authClient.getSession()

// Props pour permettre un affichage compact ou complet
const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String as PropType<'sidebar' | 'navbar'>,
    default: 'sidebar'
  }
});


const userInitials = computed(() => {
  if (!session?.user?.name) return 'U';
  const names = session.user.name.split(' ');
  return names.map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);
});

const userFullName = computed(() => {
  return session?.additional_info?.tokenDetails?.userFullName || session?.user?.name || 'Utilisateur';
});

const userEmail = computed(() => {
  return session?.additional_info?.tokenDetails?.userEmail || session?.user?.email || '';
});

// Récupérer les permissions de l'utilisateur
const userPermissions = computed(() => {
  return session?.additional_info?.persmissions || {};
});

// Déterminer le rôle actuel basé sur les permissions
const primaryRole = computed(() => {
  const permissions = userPermissions.value;

  // Prioriser certains rôles en fonction des permissions
  if (permissions.CAN_ADMIN) return 'Administrateur';
  if (permissions.CAN_POINT_FOCAL) return 'Point Focal';
  if (permissions.CAN_VALIDATEUR) return 'Validateur';
  if (permissions.CAN_SUPER_VALIDATEUR) return 'Super Validateur';
  if (permissions.CAN_PUBLISH_PROJECT) return 'Éditeur de projet';

  return 'Utilisateur';
});

// Récupérer les structures d'affectation
const userStructures = computed(() => {
  return session?.session?.additional_info?.structures || [];
});

// Formater le nom d'une structure
const getStructureName = (structure: any) => {
  return structure?.artefact?.nameJson?.fr || structure?.artefact?.name || 'Structure sans nom';
};

// Récupérer l'identifiant d'une structure
const getStructureIdentifier = (structure: any) => {
  return structure?.artefact?.identifier || '';
};

const dropdownItems = computed(() => [
  [{
    label: 'Profil & Structures',
    slot: 'userInfo',
    disabled: true
  }],
  [{
    label: 'Mon profil',
    icon: 'i-heroicons-user-circle',
    click: () => navigateTo('/admin/profil')
  }],
  [{
    label: 'Déconnexion',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: async () => {
      await logout();
    }
  }]
]);


</script>

<template>
  <UDropdown
    v-if="session "
    :items="dropdownItems"
    :ui="{
      width: 'w-full w-[240px]',
      item: {
        disabled: 'cursor-text select-text'
      }
    }"
    :popper="{ placement: compact ? 'top' : 'top-start' }"
  >
    <template #default="{ open }">
      <button
        :class="[
          'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
          variant === 'sidebar' ? 'w-full' : 'w-auto',
          compact ? 'justify-center' : '',
          variant === 'navbar'
            ? (open ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50')
            : (open ? 'bg-white/20 dark:bg-gray-800' : 'hover:bg-white/10 dark:hover:bg-gray-800/50')
        ]"
      >
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {{ userInitials }}
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        </div>

        <!-- User info (masqué en mode compact) -->
        <div v-if="!compact" class="flex-1 text-left min-w-0">
          <p :class="[
            'text-sm font-semibold truncate',
            variant === 'navbar' ? 'text-gray-900 dark:text-white' : 'text-white'
          ]">
            {{ userFullName }}
          </p>
          <p :class="[
            'text-xs truncate',
            variant === 'navbar' ? 'text-gray-600 dark:text-gray-400' : 'text-white/70'
          ]">
            {{ primaryRole }}
          </p>
        </div>

        <!-- Chevron icon -->
        <UIcon
          v-if="!compact"
          name="i-heroicons-chevron-up-20-solid"
          :class="[
            'w-5 h-5 transition-transform duration-200 flex-shrink-0',
            variant === 'navbar' ? 'text-gray-600 dark:text-gray-400' : 'text-white/70',
            { 'rotate-180': !open }
          ]"
        />
      </button>
    </template>

    <!-- Custom userInfo slot pour afficher les infos et structures -->
    <template #userInfo>
      <div class="text-left w-full border-b border-gray-200 dark:border-gray-700 space-y-3">
        <!-- Email et rôle -->
        <div>
          <p class="text-xs truncate">
            {{ userEmail }}
          </p>
          <div class="flex items-center gap-2 mt-1.5">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ primaryRole }}</span>
            </div>
          </div>
        </div>

        <!-- Structures d'affectation -->
        <div v-if="userStructures.length > 0" class="space-y-2">
          <p class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Structures</p>
          <div class="space-y-1.5">
            <div
              v-for="structure in userStructures"
              :key="structure.id"
              class="p-2 rounded-lg bg-red-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-start gap-2">
                <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {{ getStructureName(structure) }}
                  </p>
                  <p v-if="getStructureIdentifier(structure)" class="text-xs text-gray-500 dark:text-gray-400">
                    {{ getStructureIdentifier(structure) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badge Point Focal si applicable -->
        <div v-if="userPermissions.CAN_POINT_FOCAL" class="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <UIcon name="i-heroicons-star" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span class="text-xs font-semibold text-blue-900 dark:text-blue-200">Point Focal</span>
        </div>
      </div>
    </template>
  </UDropdown>


</template>

<style scoped>
/* Additional custom styles if needed */
</style>
