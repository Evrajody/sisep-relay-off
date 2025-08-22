<script lang="ts" setup>

const isOpen = ref(true);

const {sidebarAuthorized} = useAuthSidebar();

const changModuleFormEl = ref(null);

const changModuleForm = computed(() => ({

  scrollOnNext: true,

  id: "agrementForm",

  addClass: "max-w-full",

  displayErrors: true,

  showRequired: ["label"],

  endpoint: "/agrement",

  schema: {

    module_cible: {

      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },

      placeholder: "--Passer sur un autre module--",

      type: "select",

      addClasses: {
        ElementDescription: {
          container_lg: "!text-primary font-bold",
        },
      },

      rules: ["required"],

      items: [
        {
          code: "project",
          label: "Module de gestion des projets"
        },

        {
          code: "oddd",
          label: "Modules de gestion des ODD"
        },

        {
          code: "global",
          label: "Modules globales sisep"
        }
      ],
      labelProp: "label",
      valueProp: "code",
      search: true,
      native: true,
      default: 23,
      inputType: "search",
      autocomplete: "off",
    }

  }

}))

</script>

<template>
  <NuxtLoadingIndicator :height="5" color="#19474b"/>

  <client-only>

    <div class="font-Manrope">

      <UDashboardLayout
          :ui="{ wrapper: 'min-h-screen bg-gray-100 dark:bg-gray-900' }"
      >
        <UDashboardPanel
            v-model="isOpen"
            :resizable="{ min: 200, max: 500 }"
            :ui="{ wrapper: 'bg-red-500 dark:bg-gray-900' }"
            :width="300"
            collapsible
            side="right"
        >
          <UDashboardNavbar
              :ui="{
              wrapper: 'bg-white border-none dark:bg-gray-900  h-[80px]',
              container: '',
            }"
          >
            <template #left>
              <div class="py-3">
                <img
                    class="h-30 mix-blend-multiply"
                    src="~/assets/images/logo_cadre_vie.png"
                />
              </div>
            </template>
          </UDashboardNavbar>

          <UDivider/>

          <UDashboardSidebar
              :ui="{
              wrapper: 'bg-sisep-hit  dark:bg-gray-900',

              body: 'gap-y-6 py-2',
              container: 'py-0 pt-3',
              footer:
                'bg-gray-50 py-3 border-t border-gray-200 dark:bg-gray-900',
            }"
          >
            <div class="w-full">
              <client-only>
                <Vueform ref="changModuleFormEl" v-bind="changModuleForm"></Vueform>
              </client-only>
            </div>

            <UDashboardSidebarLinks
                :links="sidebarAuthorized"
                :ui="{
                  base: 'gap-3 py-2',
                  inactive: 'text-white dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:before:bg-white dark:hover:before:bg-gray-800/50',
                  active: 'text-slate-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800',
                  label: 'text-base truncate relative'
                }"
            />
            <template #footer>
              <UserMenu/>

            </template>
          </UDashboardSidebar>
        </UDashboardPanel>

        <UDashboardPage>
          <UDashboardPanel grow>

            <UDashboardNavbar
                :ui="{
                title: 'text-2xl font-bold text-blue-900',
                right: 'gap-8',
                wrapper:
                  'border-b w-full bg-white border-gray-200 h-[80px] dark:border-gray-700',
              }"
            >
              <template #toggle>
                <UDashboardNavbarToggle icon="i-heroicons-x-mark"/>
              </template>

              <template #title>
                <div class="flex flex-col w-full">
                  <h3 class="font-bold  "> Espace d'administration de SISEP BENIN </h3>
                  <div class="bg-green-800 w-fit text-lg text-white font-extrabold">
                    <span>-- Module de gestion des projets -- </span>
                  </div>
                </div>
              </template>
            </UDashboardNavbar>

            <UDashboardPanelContent :ui="{
               wrapper: '!p-0 flex-1 flex flex-col overflow-y-auto'
            }">
              <slot :key="$router.currentRoute?.href"/>
            </UDashboardPanelContent>
          </UDashboardPanel>
        </UDashboardPage>

        <UDashboardSearch/>
      </UDashboardLayout>
      <UNotifications/>
    </div>
  </client-only>
</template>
