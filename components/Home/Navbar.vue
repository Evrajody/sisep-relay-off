<template>
  <nav class="relative w-full">
    <!-- Bouton menu mobile -->
    <div class="md:hidden flex items-center justify-between w-full p-4">
      <div class="flex-1"></div>
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-white p-2 focus:outline-none">
        <UIcon v-if="!isMobileMenuOpen" name="i-heroicons-bars-3-20-solid" class="w-6 h-6" />
        <UIcon v-else name="i-heroicons-x-mark-20-solid" class="w-6 h-6" />
      </button>
    </div>
    
    <!-- Menu principal -->
    <ul :class="['md:flex gap-6 items-center w-full pr-14 sm:pr-16', isMobileMenuOpen ? 'block absolute top-full left-0 right-0 bg-sisep-hit z-50 p-4' : 'hidden']">
      <li
        v-for="(item, idx) in navMenuElements"
        :key="idx"
        class="relative"
        @mouseenter="openMenu(idx)"
        @mouseleave="closeMenu(idx)"
      >
        <!-- Trigger -->
        <template v-if="item.sections && item.sections.length">
          <button
            type="button"
            class="text-lg font-bold text-white uppercase inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            @focus="openMenu(idx)"
            @blur="closeMenu(idx)"
            aria-haspopup="true"
            :aria-expanded="openIndex === idx"
          >
            <span>{{ item.label }}</span>
            <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 transition-transform" :class="openIndex === idx ? 'rotate-180' : ''" />
          </button>

          <!-- Mega panel -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2 [filter:blur(6px)]"
            enter-to-class="opacity-100 translate-y-0 [filter:blur(0px)]"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 [filter:blur(0px)]"
            leave-to-class="opacity-0 -translate-y-2 [filter:blur(6px)]"
          >
            <div
              v-if="openIndex === idx"
              class="absolute left-1/2 -translate-x-1/2 top-full mt-12 w-[80vw] max-w-5xl z-50"
            >
              <div class=" border border-white/10 bg-white text-gray-800 shadow-2xl overflow-hidden">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                  <div v-for="(section, sIdx) in item.sections" :key="sIdx" class="p-6">
                    <h4 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{{ section.title }}</h4>
                    <ul class="space-y-2">
                      <li v-for="(link, lIdx) in section.links" :key="lIdx">
                        <NuxtLink :to="link.href" class="group flex items-start gap-3 rounded-md p-2 hover:bg-gray-50 transition-colors">
                          <UIcon v-if="link.icon" :name="link.icon" class="w-5 h-5 text-gray-400 group-hover:text-primary" />
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 truncate">{{ link.label }}</div>
                            <p v-if="link.desc" class="text-xs text-gray-500 truncate">{{ link.desc }}</p>
                          </div>
                          <UIcon name="i-heroicons-arrow-right-20-solid" class="w-4 h-4 text-gray-300 group-hover:text-primary" />
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </template>

        <!-- Simple link (no sections) -->
        <template v-else>
          <button
            v-if="item.onClick"
            @click="item.onClick"
            class="text-lg font-bold text-white uppercase cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span>{{ item.label }}</span>
          </button>
          <NuxtLink v-else :to="item.href" class="text-lg font-bold text-white uppercase">
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </li>
    </ul>
    <!-- App launcher pinned to the extreme right -->
    <div class="absolute inset-y-0 right-0 flex items-center">
      <AppLauncher />
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { UIcon } from '#components'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// State for open mega menu index
const openIndex = ref<number | null>(null)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

const { signIn, data } = useAuth();

// Vérifier la taille de l'écran au chargement
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// Écouter les changements de taille d'écran
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

// Nettoyer l'écouteur d'événement
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

function openMenu(idx: number) {
  openIndex.value = idx
}
function closeMenu(idx: number) {
  // close only if the currently open index matches
  if (openIndex.value === idx) openIndex.value = null
}

// Menu configuration: simple links or mega menu with sections
const navMenuElements = reactive([
  {
    label: 'Accueil',
    href: '/',
  },
  {
    label: 'Projets',
    sections: [
      {
        title: 'Par thématique',
        links: [
          { label: 'Infrastructures', href: '/project?category=infrastructures', icon: 'i-heroicons-building-office-2' },
          { label: 'Environnement', href: '/project?category=environnement', icon: 'i-heroicons-sparkles' },
          { label: 'Énergie', href: '/project?category=energie', icon: 'i-heroicons-bolt' },
        ],
      },
      {
        title: 'Par statut',
        links: [
          { label: 'En cours', href: '/project?status=ongoing', icon: 'i-heroicons-play' },
          { label: 'Planifiés', href: '/project?status=planned', icon: 'i-heroicons-calendar-days' },
          { label: 'Clôturés', href: '/project?status=closed', icon: 'i-heroicons-check-circle' },
        ],
      },
      {
        title: 'Accès rapide',
        links: [
          { label: 'Tous les projets', href: '/project', desc: 'Parcourez l’ensemble du catalogue', icon: 'i-heroicons-rectangle-stack' },
          { label: 'Créer un projet', href: '/project/create-project', desc: 'Ajouter un nouveau projet', icon: 'i-heroicons-plus-circle' },
        ],
      },
    ],
  },
  {
    label: 'Conventions',
    sections: [
      {
        title: 'Par catégorie',
        links: [
          { label: 'Climat', href: '/conventions?category=climat', icon: 'i-heroicons-globe-alt' },
          { label: 'Biodiversité', href: '/conventions?category=biodiversite', icon: 'i-heroicons-leaf' },
          { label: 'Pollution', href: '/conventions?category=pollution', icon: 'i-heroicons-exclamation-circle' },
        ],
      },
      {
        title: 'Par type',
        links: [
          { label: 'Multilatérales', href: '/conventions?type=multilaterale', icon: 'i-heroicons-users' },
          { label: 'Bilatérales', href: '/conventions?type=bilaterale', icon: 'i-heroicons-user-group' },
        ],
      },
      {
        title: 'Accès rapide',
        links: [
          { label: 'Toutes les conventions', href: '/conventions', desc: 'Voir la liste complète', icon: 'i-heroicons-rectangle-group' },
        ],
      },
    ],
  },
  {
    label: 'Espace',
    href: '/admin/login',
    onClick: async () => {
      await signIn('keycloak', {
        redirect: "/admin/project-module/dashboard"
      })
    }
  },
])
</script>
