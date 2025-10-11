<script lang="ts" setup>
import { UIcon } from "#components";

definePageMeta({
  layout: "login-layout",
});

const links = [{
  label: 'Création d\'un nouveau projet',
  icon: 'i-heroicons-user-circle'
}]

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

const passwordVisible = ref(false);
const loginPermisFormEl = ref(null);


const loginPermisForm = ref({

  scrollOnNext: true,

  id: "suivre-demande",

  addClass: "max-w-full",

  displayErrors: true,

  showRequired: ["label"],

  endpoint: async (form: any, payload: any) => {
    navigateTo({name: 'admin-project-module-dashboard'})
  },

  schema: {
    email: {
      type: "text",
      inputType: "text",
      label: "Email",
      placeholder: "sisep.admin@projet.bj",
      rules: "required|email",
      columns: {
        default: { container: 12, label: 12, wrapper: 12 },
        sm: { container: 12, label: 12, wrapper: 12 },
        md: { container: 12, label: 12, wrapper: 12 },
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
    password: {
      rules: "required",
      inputType: "password",
      type: "text",
      label: "Mot de passe",
      slots: {
        "addon-after": () =>
            h(UIcon, {
              name: !passwordVisible.value
                  ? "i-heroicons-eye"
                  : "i-heroicons-eye-slash",
              class: "text-permis-base cursor-pointer size-6",
              onClick: () => {
                passwordVisible.value = !passwordVisible.value;
                if (passwordVisible.value == true) {
                  loginPermisFormEl.value.schema.password.inputType = "text";
                } else {
                  loginPermisFormEl.value.schema.password.inputType = "password";
                }
              },
            }),
      },
      columns: {
        default: { container: 12, label: 12, wrapper: 12 },
        sm: { container: 12, label: 12, wrapper: 12 },
        md: { container: 12, label: 12, wrapper: 12 },
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },

    register: {
      type: "button",
      submits: true,
      buttonLabel: "Se connecter",
      full: true,
      columns: {
        default: { container: 12, label: 12, wrapper: 12 },
        sm: { container: 12, label: 12, wrapper: 12 },
        md: { container: 12, label: 12, wrapper: 12 },
        lg: { container: 12, label: 12, wrapper: 12 },
      },
    },
  },
});
</script>

<template>
  <Head>
    <title> Login | Sisep Administration </title>
  </Head>

  <section
      class="bg-gray-200 font-manrope relative h-screen bg-cover bg-[url('https://www.gouv.bj/upload/images/articles/ckeditor/amazone2.jpg')]"
  >
    <div class="bg-black/30 absolute inset-0"></div>
    <div class="min-h-screen">
      <div
          class="flex h-screen flex-col items-start gap-2 order-1 justify-center px-4 py-10 sm:px-6 lg:px-8 sm:py-16 lg:py-24"
      >
        <div
            class=" w-full max-w-sm xl:max-w-lg shadow-lg bg-primary/10 backdrop-blur-2xl z-5 rounded-md p-2 mx-auto">

          <div class="shadow-lg bg-white z-5 border border-gray-200  rounded-md  px-5 py-6 w-full">

            <div class="flex w-full justify-center px-2 gap-8">
              <a class="text-black" href="/"
              >
                <img
                    class="h-30 mix-blend-multiply"
                    src="~/assets/images/logo_cadre_vie.png"
                />
              </a>
            </div>

            <div id="error"></div>

            <h4 class="font-bold text-center pt-4 text-2xl">
              Plateforme d'administration SISEB
            </h4>

            <div class="mt-8">
              <ClientOnly>
                <Vueform ref="loginPermisFormEl" v-bind="loginPermisForm" />
              </ClientOnly>
            </div>
            
            <div class="py-5"></div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
