<script setup lang="ts">
import type { PropType } from 'vue';

const { data: session, status } = useAuth();

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

const isOpen = ref(false);

const userInitials = computed(() => {
  if (!session.value?.user?.name) return 'U';
  const names = session.value.user.name.split(' ');
  return names.map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);
});

const userFullName = computed(() => {
  return session.value?.additional_info?.tokenDetails?.userFullName || session.value?.user?.name || 'Utilisateur';
});

const userEmail = computed(() => {
  return session.value?.additional_info?.tokenDetails?.userEmail || session.value?.user?.email || '';
});

const userRoles = computed(() => {
  const resources = session.value?.additional_info?.tokenDetails?.userResources;
  if (!resources) return [];

  // Récupérer tous les rôles de tous les modules
  const allRoles: string[] = [];
  Object.values(resources).forEach((module: any) => {
    if (module.roles) {
      allRoles.push(...module.roles);
    }
  });

  return allRoles;
});

const primaryRole = computed(() => {
  const roles = userRoles.value;
  if (roles.length === 0) return 'Utilisateur';

  // Prioriser certains rôles
  if (roles.includes('POINT_FOCAL')) return 'Point Focal';
  if (roles.includes('ADMIN')) return 'Administrateur';

  // Sinon retourner le premier rôle formaté
  return roles[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
});

const dropdownItems = computed(() => [
  [{
    label: userEmail.value,
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Mon profil',
    icon: 'i-heroicons-user-circle',
    click: () => navigateTo('/admin/profile')
  }, {
    label: 'Paramètres',
    icon: 'i-heroicons-cog-6-tooth',
    click: () => navigateTo('/admin/settings')
  }],
  [{
    label: 'Déconnexion',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: async () => {
      await signOut({ callbackUrl: '/admin/login' });
    }
  }]
]);

const { signOut } = useAuth();
</script>

<template>
  <UDropdown
    v-if="status === 'authenticated'"
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

    <!-- Custom account slot pour afficher l'email -->
    <template #account>
      <div class="text-left px-2 py-1.5">
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ userEmail }}
        </p>
      </div>
    </template>
  </UDropdown>

  <!-- Loading state -->
  <div v-else-if="status === 'loading'" class="w-full px-3 py-3">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div v-if="!compact" class="flex-1 space-y-2">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
