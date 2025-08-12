<script lang="ts" setup>


const user = ref({
  name: `Concepteur Admin`,
  avatar: {
    src: "#",
    alt: `concepteur admin`,
  },
});

const items = computed(() => [
  [
    {
      type: "label",
      label: user.value.name,
      avatar: user.value.avatar,
    },
  ],
  [
    {
      label: "Profil",
      icon: "i-lucide-user",
      click: () => {

      },
    },
  ],
  [
    {
      label: "Déconnexion",
      icon: "i-lucide-log-out",
      click: async () => {
        // await signOut({ callbackUrl: "/admin/login" });
      },
    },
  ],
]);

const profileTabItems = ref([
  {
    key: "profil",
    label: "Profil",
    icon: "i-lucide-user",
  },
  {
    key: "password",
    label: "Mot de passe",
    icon: "i-lucide-lock",
  },

  {
    key: "config",
    label: "Configuration",
    icon: "i-heroicons-outline-cog-6-tooth",
  },
]);

const isFirstConnect = false;

const collapsed = ref(false);

</script>

<template>
  <UDropdown
    :content="{ align: 'center', collisionPadding: 12 }"
    :items="items"
    :ui="{
      width: 'max-w-[300px]',
      content: collapsed
        ? 'w-full flex justify-between'
        : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
    mode="hover"
  >
    <div class="flex flex-col">
      <div class="flex items-center">
        <!--        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />-->
        <Icon name="i-heroicons-user-circle-16-solid" size="24"></Icon>

        <UButton
          :square="collapsed"
          class="data-[state=open]:bg-(--ui-bg-elevated) bg-red-700"
          v-bind="{
            ...user,
            label: collapsed ? undefined : user?.name,

            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
          }"
          variant="ghost"
        />
      </div>
    </div>
  </UDropdown>

<!--  <UDashboardModal-->
<!--    v-model="isProfileMenuOpen"-->
<!--    :prevent-close="isFirstConnect"-->
<!--    :ui="{-->
<!--      rounded: 'rounded-none',-->
<!--      base: 'py-0',-->
<!--      icon: { base: 'text-red-500 dark:text-red-400' },-->
<!--      overlay: { background: 'bg-gray-900/20  backdrop-blur-sm' },-->
<!--      footer: { base: 'bg-gray-100' },-->
<!--      width: 'w-full sm:max-w-4xl',-->
<!--      header: {-->
<!--        base: 'bg-gray-100 border-b w-full items-center  border-gray-200',-->
<!--        inner: 'py-0 h-full',-->
<!--        padding: 'py-2',-->
<!--      },-->
<!--    }"-->
<!--  >-->
<!--    <template #header>-->
<!--      <div class="flex w-full">-->
<!--        <div class="flex-1">-->
<!--          <h2 class="font-bold text-lg text-blue-600">-->
<!--            Mon profil utilisateur-->
<!--          </h2>-->
<!--        </div>-->

<!--        <button-->
<!--          v-if="!isFirstConnect"-->
<!--          class="text-red-500 font-bold grid place-items-center bg-gray-300 rounded-sm p-2 px-3"-->
<!--          @click="null"-->
<!--        >-->
<!--          <Icon name="i-heroicons-x-mark-20-solid" size="22"></Icon>-->
<!--        </button>-->
<!--      </div>-->
<!--    </template>-->

<!--    <div class="">-->
<!--      <UDashboardSection>-->
<!--        <template #icon>-->
<!--          <div-->
<!--            class="size-32 bg-primary/10 rounded-full grid place-items-center"-->
<!--          >-->
<!--            <Icon-->
<!--              class="size-full"-->
<!--              name="i-heroicons-user-circle-16-solid"-->
<!--            ></Icon>-->
<!--          </div>-->
<!--        </template>-->

<!--        <template #title>-->
<!--          <h2 class="text-2xl font-bold">-->
<!--            {{ data?.user?.nom }} {{ data?.user?.prenoms }}-->
<!--          </h2>-->
<!--        </template>-->

<!--        <template #description>-->
<!--          <div class="flex flex-col space-y-4">-->
<!--            <h2 class="text-base text-gray-600">-->
<!--              {{ data?.user?.email }} | {{ data?.user?.tel }}-->
<!--            </h2>-->

<!--            <UBadge class="w-fit" color="primary" size="sm" variant="subtle"-->
<!--              >{{ data?.user?.role?.desc }}-->
<!--            </UBadge>-->
<!--          </div>-->
<!--        </template>-->
<!--      </UDashboardSection>-->

<!--      <div v-if="isFirstConnect" class="relative w-full my-4 h-fit">-->
<!--        <div-->
<!--          class="absolute border-2 py-2 rounded-md border-red-700 w-full h-full border-inherit opacity-80 pulsar"-->
<!--        ></div>-->
<!--        <UAlert-->
<!--          class=""-->
<!--          color="red"-->
<!--          description="Merci de modifier votre mot de passe pour continuer"-->
<!--          icon="i-heroicons-bell-solid"-->
<!--          title="Important !"-->
<!--          variant="solid"-->
<!--        />-->
<!--      </div>-->

<!--      <UTabs-->
<!--        :default-index="isFirstConnect ? 1 : 0"-->
<!--        :items="profileTabItems"-->
<!--        :ui="{-->
<!--          wrapper: 'gap-4',-->
<!--          list: {-->
<!--            width: 'w-fit',-->
<!--            tab: { base: '!justify-start', background: '', size: 'text-md' },-->
<!--          },-->
<!--        }"-->
<!--        orientation="horizontal"-->
<!--      >-->
<!--        <template #item="{ item }">-->
<!--          <div-->
<!--            v-if="item.key == 'profil'"-->
<!--            class="bg-white/50 rounded-lg backdrop-blur-2xl p-1.5"-->
<!--          >-->
<!--            <div-->
<!--              class="w-full first:rounded-l-[calc(var(&#45;&#45;ui-radius)*2)] last:rounded-r-[calc(var(&#45;&#45;ui-radius)*2)] hover:z-1"-->
<!--            >-->
<!--              <Vueform ref="updateUserFormEl" v-bind="updateUserForm" />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div-->
<!--            v-if="item.key == 'password'"-->
<!--            class="bg-white/50 rounded-lg backdrop-blur-2xl p-1.5"-->
<!--          >-->
<!--            <div>-->
<!--              <Vueform ref="updatePasswordFormEl" v-bind="updatePasswordForm" />-->
<!--            </div>-->
<!--          </div>-->

<!--          <div-->
<!--            v-if="item.key == 'config'"-->
<!--            class="bg-white/50 rounded-lg backdrop-blur-2xl p-1.5"-->
<!--          >-->
<!--            <div>-->
<!--              <Vueform ref="autoValidationFormEl" v-bind="autoValidationForm" />-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </UTabs>-->
<!--    </div>-->
<!--  </UDashboardModal>-->
</template>
