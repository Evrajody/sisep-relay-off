<script lang="ts" setup>

import { UIcon } from "#components";

definePageMeta({
  layout: "login-layout",
});


const { $authClient } = useNuxtApp()

const login = async () => {
  await $authClient.signIn.sso({
    providerId: "keycloak",
    callbackURL: "/admin/project-module/dashboard",
  });
}



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

            <h4 class="font-bold text-center py-5 text-2xl">
              Plateforme d'administration SISEB
            </h4>


            <div class=" space-y-3">
              <NuxtLink
                  class="relative inline-flex cursor-pointer items-center bg-blue-400 justify-center w-full px-4 py-4 text-base font-semibold  transition-all duration-200 text-white shadow rounded-md hover:bg-blue-100 focus:bg-blue-100 hover:text-black focus:text-black focus:outline-none"
                  @click.prevent="async () => await login()">
                <div class="absolute inset-y-0 left-0 p-4">
                  <svg
                      class="w-6 h-6 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                    ></path>
                  </svg>
                </div>
                Se connecter avec mon compte integré
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
