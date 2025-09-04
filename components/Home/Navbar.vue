<template>
  <div class="">
    <ul class="flex gap-6 items-center">
      <li v-for="item in navMenuElements">
        <NuxtLink :to="item.href" class="text-lg font-bold text-white uppercase">
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const navMenuElements = reactive([
  {
    label: "Accueil",
    href: "/",
  },


  {
    label: "Projet",
    href: "/project",
  },


  {
    label: "Conventions",
    href: "/conventions",
  },


  {
    label: "Espace",
    href: "/admin/login",
  },

]);
</script>
