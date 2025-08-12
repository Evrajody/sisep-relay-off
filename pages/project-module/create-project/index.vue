<script lang="ts" setup>

definePageMeta({
  layout: "sisep-app-layout",
});

const links = [{
  label: 'Création d\'un nouveau projet',
  icon: 'i-heroicons-user-circle'
}]

useHead({
  title: 'Création d\'un nouveau projet',
});

const createProjectFormEl = ref(null);

const createProjectForm = computed(() => ({

  scrollOnNext: true,

  id: "createProjetForm",

  addClass: "max-w-full",

  displayErrors: true,

  showRequired: ["label"],

  endpoint: "/agrement",

  schema: {

    titre: {
      type: 'text',
      label: "Intitulé du projet",
      description: "Fournisseur un titre génériques pour le projet",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },

    description: {
      type: 'editor',
      label: "Description du projet",
      description: "Décrivez le projet",
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },

    city: {

      label: "Villes concernées par le projet",

      placeholder: "--Selectionner les villes--",

      type: "tags",

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
      inputType: "search",
      autocomplete: "off",
    },

    region: {

      label: "Départements concernées par le projet",

      placeholder: "--Selectionnez les départements--",

      type: "tags",

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
      inputType: "search",
      autocomplete: "off",
    },

    long: {
      type: 'text',
      label: "Longitude",
      rules: ['required']
    },

    lat: {
      type: 'text',
      label: "Latitude",
      rules: ['required']
    },

    file: {
      type: "file",
      label: "Fichier",
      multiple: true,
      drop: true,
      columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 12, label: 12, wrapper: 12},
      },
    },

    button: {
      type: "button",
      buttonLabel: "Ajouter",
      submits: true,
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

  <UDashboardToolbar :ui="{ wrapper: 'bg-white dark:bg-gray-900' }" class="py-0 px-1.5 overflow-x-auto">
    <UHorizontalNavigation :links="links"/>
  </UDashboardToolbar>


  <div class="max-w-5xl w-full py-5 mx-auto">

    <UDashboardCard
        :ui="{
        wrapper: 'border-b border-gray-100',
        header: {
          wrapper: 'border-b border-gray-100'
        }
      }"
    >

      <template #title>
        Creation d'un nouveau projet
      </template>

      <template #description>
        Merci de remplir les champs obligatoires pour terminer la création
      </template>


      <div class="">
        <Vueform v-bind="createProjectForm" ref="createProjectFormEl"/>
      </div>

    </UDashboardCard>

  </div>


</template>

<style scoped>

</style>