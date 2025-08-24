<template>
  <div class="">
    <ul class="flex gap-6 items-center">
      <li v-for="item in navMenuElements">
        <a :href="item.href" class="text-lg font-bold text-white uppercase">
          <span>{{ item.label }}</span>
        </a>
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
    label: "ODDs",
    href: "/odds",
  },

  {
    label: "Espace",
    href: "/admin/login",
  },


  // {
  //   label: "A propos",
  //   href: "#",
  // },

  // {
  //   label: "Données",
  //   href: "#",
  // },


  // {
  //   label: "Faqs",
  //   href: "#",
  // },
]);
</script>
