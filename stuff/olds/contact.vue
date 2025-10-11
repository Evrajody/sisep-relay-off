<script lang="ts" setup>

const loadTrigger = ref(false)
const username = ref('ok done')

const toogleLoadTrigger = () => loadTrigger.value = !loadTrigger.value

watch(loadTrigger, (v) => {
  username.value = "yes done"
})

const demoForm = computed(() => ({
  loading: loadTrigger.value,
  default: {
    moniteur: username.value
  },
  schema: {
    moniteur: {
      label: "Référence de la pièce",
      type: "text",
      rules: ["required"],
      placeholder: "..",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: loadTrigger ? 12 : 6, label: 12, wrapper: 12},
      },
    },

    submit: {
      type: 'button',
      submits: true,
      buttonLabel: username.value,
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    }
  }
}))

</script>

<template>

  <div class="container max-w-4xl  mx-auto">

    <client-only fallback="d">
      <Vueform v-bind="demoForm"></Vueform>
    </client-only>

    <UButton class="my-4" @click.prevent="toogleLoadTrigger">
      Change state
    </UButton>


  </div>


</template>

<style scoped>

</style>