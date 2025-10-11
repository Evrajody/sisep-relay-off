<script setup lang="ts">
// Layout spécifique pour la page d'accueil publique
</script>

<template>
  <div class="home-layout">
    <NuxtPage :key="$router.currentRoute?.href"/>
  </div>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  width: 100%;
}
</style>
