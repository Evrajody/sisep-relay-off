<template>
  <div class="relative" ref="root" @keydown.esc.prevent.stop="close">
    <!-- Trigger button -->
    <button
      type="button"
      class="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      aria-label="Applications"
      aria-haspopup="true"
      :aria-expanded="open ? 'true' : 'false'"
      @click="toggle"
    >
      <UIcon name="i-heroicons-squares-2x2-20-solid" class="w-6 h-6 text-white" />
    </button>

    <!-- Panel -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-3 w-80 sm:w-[28rem] z-50"
        role="dialog"
        aria-label="Lanceur d'applications"
      >
        <div class="overflow-hidden rounded-xl border border-white/10 bg-white/95 backdrop-blur shadow-2xl">
          <div class="p-3 border-b border-gray-100 flex items-center justify-between">
            <span class="text-sm font-semibold text-gray-700">Applications</span>
            <button class="p-1 rounded hover:bg-gray-100" @click="close" aria-label="Fermer">
              <UIcon name="i-heroicons-x-mark-20-solid" class="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div class="p-3">
            <ul class="grid grid-cols-3 gap-3">
              <li v-for="(app, idx) in appsToShow" :key="idx">
                <NuxtLink
                  :to="app.href"
                  class="group flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  @click="close"
                >
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-primary/10">
                    <UIcon :name="app.icon || defaultIcon" class="w-6 h-6 text-gray-600 group-hover:text-primary" />
                  </div>
                  <span class="text-xs font-medium text-gray-800 text-center line-clamp-2">{{ app.label }}</span>
                </NuxtLink>
              </li>
            </ul>

            <div v-if="extraApps.length" class="mt-3">
              <button
                class="w-full text-center text-sm text-primary font-medium py-2 rounded hover:bg-primary/5"
                type="button"
                @click="toggleShowAll"
              >
                {{ showAll ? 'Voir moins' : 'Voir plus' }}
              </button>
            </div>
          </div>

          <div class="px-3 pb-3 text-[11px] text-gray-500">
            Conseil: appuyez sur Échap pour fermer
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { UIcon } from '#components'

interface AppItem {
  label: string
  href: string
  icon?: string
}

const props = withDefaults(defineProps<{ apps?: AppItem[]; maxDefault?: number }>(), {
  apps: () => [
    { label: 'Accueil', href: '/', icon: 'i-heroicons-home' },
    { label: 'Projets', href: '/project-module', icon: 'i-heroicons-rectangle-stack' },
    { label: 'Créer un projet', href: '/admin/project-module/create-project', icon: 'i-heroicons-plus-circle' },
    { label: 'Tableau de bord', href: '/admin/project-module/dashboard', icon: 'i-heroicons-chart-bar' },
    { label: 'Conventions', href: '/conventions', icon: 'i-heroicons-rectangle-group' },
    { label: 'Espace admin', href: '/admin/login', icon: 'i-heroicons-cog-6-tooth' },
  ],
  maxDefault: 6,
})

const open = ref(false)
const showAll = ref(false)
const defaultIcon = 'i-heroicons-squares-2x2-20-solid'
const root = ref<HTMLElement | null>(null)

const extraApps = computed(() => (props.apps.length > props.maxDefault ? props.apps.slice(props.maxDefault) : []))
const appsToShow = computed(() => (showAll.value ? props.apps : props.apps.slice(0, props.maxDefault)))

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}
function toggleShowAll() {
  showAll.value = !showAll.value
}

// Close when clicking outside
onMounted(() => {
  const onClick = (e: MouseEvent) => {
    if (!root.value) return
    if (!root.value.contains(e.target as Node)) {
      close()
    }
  }
  document.addEventListener('click', onClick)
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
})
</script>

<style scoped>
/* Ensure smooth scaling animation origin */
:deep(.origin-top-right) {
  transform-origin: top right;
}
</style>
