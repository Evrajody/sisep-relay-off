<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import type {Project} from '~/types';
import useProjectDetail from '~/composables/project/useProjectDetail';
import { useLoading } from '~/composables/useLoading';
import { useToast } from '~/composables/useToast';
import { useFileDisplay } from '~/composables/useFileDisplay';

const route = useRoute();
const projectId = route.params.id as string;

const {
  project,
  isLoading,
  error,
  fetchProject,
  updateProjectStatus,
  formatDate,
  getStatusBadge,
} = useProjectDetail();

const activeTab = ref(1);
const showActionModal = ref(false);
const selectedAction = ref<string>('');
const assignFocalPointModal = ref(false);
const focalPointName = ref('');

// Composable pour l'affichage des fichiers
const { getFileDisplayUrl, getFileIcon, getFileType, downloadFile, openFileInNewTab } = useFileDisplay();

// Modal pour prévisualiser les fichiers
const filePreviewModal = ref(false);
const previewFile = ref<any>(null);

// Actions du projet
const deleteProject = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    try {
      useLoading().start('Suppression du projet...');
      // Implémentez la logique de suppression ici
      useToast().add({
        title: 'Projet supprimé',
        description: 'Le projet a été supprimé avec succès.',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      });
      navigateTo('/project-module');
    } catch (err) {
      useToast().add({
        title: 'Erreur',
        description: 'Impossible de supprimer le projet.',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      });
    } finally {
      useLoading().finish();
    }
  }
};

const assignFocalPoint = async () => {
  if (!focalPointName.value) {
    useToast().add({
      title: 'Erreur',
      description: 'Veuillez sélectionner un point focal.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'orange'
    });
    return;
  }

  try {
    useLoading().start('Affectation du point focal...');
    // Implémentez la logique d'affectation ici
    useToast().add({
      title: 'Point focal affecté',
      description: `Le projet a été affecté à ${focalPointName.value}.`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
    assignFocalPointModal.value = false;
    focalPointName.value = '';
  } catch (err) {
    useToast().add({
      title: 'Erreur',
      description: 'Impossible d\'affecter le point focal.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  } finally {
    useLoading().finish();
  }
};

const validateProject = async () => {
  if (confirm('Voulez-vous valider ce projet ?')) {
    await updateProjectStatus('PUBLISHED');
    useToast().add({
      title: 'Projet validé',
      description: 'Le projet a été validé avec succès.',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
  }
};

const rejectProject = async () => {
  if (confirm('Voulez-vous rejeter ce projet ?')) {
    await updateProjectStatus('REJECTED');
    useToast().add({
      title: 'Projet rejeté',
      description: 'Le projet a été rejeté.',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    });
  }
};

const submitForValidation = async () => {
  if (confirm('Soumettre ce projet pour validation ?')) {
    await updateProjectStatus('PENDING');
    useToast().add({
      title: 'Projet soumis',
      description: 'Le projet a été soumis pour validation.',
      icon: 'i-heroicons-paper-airplane',
      color: 'blue'
    });
  }
};

// Actions disponibles
const projectActions = computed(() => [
  [
    {
      label: 'Modifier',
      icon: 'i-heroicons-pencil-square',
      click: () => navigateTo(`/project-module/${projectId}/edit`)
    },
    {
      label: 'Affecter un point focal',
      icon: 'i-heroicons-user-plus',
      click: () => assignFocalPointModal.value = true
    }
  ],
  [
    {
      label: 'Soumettre pour validation',
      icon: 'i-heroicons-paper-airplane',
      click: submitForValidation,
      disabled: project.value?.status === 'PENDING' || project.value?.status === 'PUBLISHED'
    },
    {
      label: 'Valider',
      icon: 'i-heroicons-check-circle',
      click: validateProject,
      disabled: project.value?.status === 'PUBLISHED'
    },
    {
      label: 'Rejeter',
      icon: 'i-heroicons-x-circle',
      click: rejectProject,
      disabled: project.value?.status === 'REJECTED'
    }
  ],
  [
    {
      label: 'Exporter en PDF',
      icon: 'i-heroicons-document-arrow-down',
      click: () => alert('Export PDF en cours de développement')
    },
    {
      label: 'Supprimer',
      icon: 'i-heroicons-trash',
      click: deleteProject,
      class: 'text-red-600'
    }
  ]
]);

// Onglets
const tabs = [
  {id: 'overview', label: 'Aperçu', icon: 'i-heroicons-home', slot: 'overview'},
  {id: 'details', label: 'Détails', icon: 'i-heroicons-information-circle', slot: 'details'},
  {id: 'indicators', label: 'Indicateurs', icon: 'i-heroicons-chart-bar', slot: 'indicators'},
  {id: 'finances', label: 'Financement', icon: 'i-heroicons-currency-dollar', slot: 'finances'},
  {id: 'partners', label: 'Partenaires', icon: 'i-heroicons-building-office', slot: 'partners'},
  {id: 'files', label: 'Fichiers', icon: 'i-heroicons-document', slot: 'files'},
];

const loadProject = async () => {
  const loading = useLoading();
  try {
    loading.start('Chargement du projet...');
    await fetchProject(projectId);
  } catch (err) {
    console.error('Erreur lors du chargement du projet:', err);
    useToast().add({
      title: 'Erreur',
      description: 'Impossible de charger les détails du projet',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    });
  } finally {
    loading.finish();
  }
};

onMounted(() => {
  loadProject();
});

useHead({
  title: computed(() => project.value ? `${project.value.title} - Détails` : 'Chargement...'),
});

definePageMeta({
  layout: "sisep-app-layout",
});

</script>

<template>
  <div class=" bg-gray-50 dark:bg-gray-900">
    <!-- En-tête avec image de couverture -->
    <div class="relative">
      <!-- Image de couverture -->
      <div class="h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900">
        <img 
          v-if="project?.coverImageId"
          :src="getFileDisplayUrl(project?.coverImageId)"
          :alt="project.title || 'Image de couverture du projet'"
          class="w-full h-full object-cover"
        >
      </div>

<!--      <pre>-->
<!--        {{ project }}-->
<!--      </pre>-->

      <!-- Informations principales superposées -->
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="flex items-end justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <UBadge :color="getStatusBadge(project?.status || 'DRAFT').color" size="lg" variant="solid">
                  {{ getStatusBadge(project?.status || 'DRAFT').label }}
                </UBadge>
                <UBadge color="white" size="lg" variant="outline">
                  <UIcon name="i-heroicons-calendar" class="mr-1" />
                  {{ formatDate(project?.startDate) }} - {{ formatDate(project?.endDate) }}
                </UBadge>
              </div>
              <h1 class="text-3xl font-bold text-white mb-2">
                {{ project?.title || 'Chargement...' }}
              </h1>
              <p class="text-white/90 text-sm">
                <UIcon name="i-heroicons-user" class="mr-1" />
                Créé par {{ project?.createdBy }} le {{ formatDate(project?.createdAt) }}
              </p>
            </div>

            <!-- Actions rapides -->
            <div class="flex gap-2">
              <UButton
                color="white"
                variant="solid"
                icon="i-heroicons-pencil-square"
                @click="navigateTo(`/project-module/${projectId}/edit`)"
              >
                Modifier
              </UButton>
              <UDropdown :items="projectActions" :popper="{ placement: 'bottom-end' }">
                <UButton
                  color="white"
                  variant="solid"
                  trailing-icon="i-heroicons-ellipsis-vertical"
                  square
                />
              </UDropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Navigation par onglets -->
      <div class="mb-8">
        <UTabs :items="tabs" v-model="activeTab">
          <!-- Onglet Aperçu -->
          <template #overview>
            <div class="space-y-6 mt-6">
              <!-- Statistiques clés -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <UCard>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <UIcon name="i-heroicons-tag" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p class="text-lg font-semibold">{{ project?.type?.name || 'N/A' }}</p>
                    </div>
                  </div>
                </UCard>

                <UCard>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <UIcon name="i-heroicons-users" class="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Partenaires</p>
                      <p class="text-lg font-semibold">{{ project?.partners?.length || 0 }}</p>
                    </div>
                  </div>
                </UCard>

                <UCard>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Indicateurs</p>
                      <p class="text-lg font-semibold">{{ project?.indicators?.length || 0 }}</p>
                    </div>
                  </div>
                </UCard>

                <UCard>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Localisation</p>
                      <p class="text-lg font-semibold">{{ project?.location?.city || 'N/A' }}</p>
                    </div>
                  </div>
                </UCard>
              </div>

              <!-- Description -->
              <UCard>
                <template #header>
                  <h2 class="text-xl font-semibold flex items-center gap-2">
                    <UIcon name="i-heroicons-document-text" />
                    Description
                  </h2>
                </template>
                <div v-html="project?.description || 'Aucune description fournie'" class="prose dark:prose-invert max-w-none"></div>
              </UCard>

              <!-- Objectifs et Résultats -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UCard>
                  <template #header>
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                      <UIcon name="i-heroicons-flag" class="text-green-600" />
                      Objectif principal
                    </h3>
                  </template>
                  <div v-html="project?.objective?.goal || 'Non défini'" class="prose dark:prose-invert max-w-none text-sm"></div>
                </UCard>

                <UCard>
                  <template #header>
                    <h3 class="text-lg font-semibold flex items-center gap-2">
                      <UIcon name="i-heroicons-trophy" class="text-yellow-600" />
                      Résultats attendus
                    </h3>
                  </template>
                  <div v-html="project?.expectedResults?.result || 'Non définis'" class="prose dark:prose-invert max-w-none text-sm"></div>
                </UCard>
              </div>

              <!-- Actions du projet -->
              <UCard v-if="project?.actions?.length">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon name="i-heroicons-clipboard-document-check" />
                    Actions ({{ project.actions.length }})
                  </h3>
                </template>
                <div class="space-y-3">
                  <div
                    v-for="action in project.actions"
                    :key="action.id"
                    class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <UIcon name="i-heroicons-check-badge" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div class="flex-1">
                      <p class="font-medium">{{ action.type }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ action.description }}</p>
                      <UBadge :color="action.status === 'EFFECTUÉ' ? 'green' : 'gray'" size="xs" class="mt-1">
                        {{ action.status }}
                      </UBadge>
                    </div>
                  </div>
                </div>
              </UCard>

              <!-- Cibles -->
              <UCard v-if="project?.targets?.length">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon name="i-heroicons-user-group" />
                    Cibles ({{ project.targets.length }})
                  </h3>
                </template>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="target in project.targets"
                    :key="target.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h4 class="font-semibold mb-1">{{ target.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ target.description || 'Aucune description' }}</p>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Onglet Détails -->
          <template #details>
            <div class="space-y-6 mt-6">
              <UCard>
                <template #header>
                  <h2 class="text-xl font-semibold">Informations détaillées</h2>
                </template>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Département</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.location?.region || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Commune</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.location?.city || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Lien d'information</dt>
                    <dd class="mt-1 text-sm">
                      <a v-if="project?.infoLinks?.infoLinks_website"
                         :href="project.infoLinks.infoLinks_website"
                         target="_blank"
                         class="text-blue-600 hover:underline">
                        {{ project.infoLinks.infoLinks_website }}
                      </a>
                      <span v-else class="text-gray-900 dark:text-white">N/A</span>
                    </dd>
                  </div>
                </dl>
              </UCard>

              <!-- Leçons apprises -->
              <UCard v-if="project?.lessonsLearned?.lesson">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon name="i-heroicons-light-bulb" class="text-yellow-500" />
                    Leçons apprises
                  </h3>
                </template>
                <div v-html="project.lessonsLearned.lesson" class="prose dark:prose-invert max-w-none"></div>
              </UCard>

              <!-- Vérifications -->
              <UCard v-if="project?.verifications?.length">
                <template #header>
                  <h3 class="text-lg font-semibold flex items-center gap-2">
                    <UIcon name="i-heroicons-shield-check" />
                    Vérifications
                  </h3>
                </template>
                <div class="space-y-3">
                  <div
                    v-for="verification in project.verifications"
                    :key="verification.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <p class="text-sm">
                      <span class="font-medium">Niveau:</span>
                      {{ verification.verificationLevel || 'Non spécifié' }}
                    </p>
                    <p class="text-sm" v-if="verification.verificationDate">
                      <span class="font-medium">Date:</span>
                      {{ formatDate(verification.verificationDate) }}
                    </p>
                    <p class="text-sm" v-if="verification.verifier?.name">
                      <span class="font-medium">Vérificateur:</span>
                      {{ verification.verifier.name }}
                      <span v-if="verification.verifier.organization">({{ verification.verifier.organization }})</span>
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Onglet Indicateurs -->
          <template #indicators>
            <div class="space-y-6 mt-6">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Indicateurs de performance</h2>
                    <UButton color="primary" icon="i-heroicons-plus" size="sm">
                      Ajouter un indicateur
                    </UButton>
                  </div>
                </template>
                <div v-if="project?.indicators?.length" class="space-y-4">
                  <div
                    v-for="indicator in project.indicators"
                    :key="indicator.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <h4 class="font-semibold mb-2">{{ indicator.name }}</h4>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span>Valeur actuelle: {{ indicator.value }}</span>
                        <span>Cible: {{ indicator.target }}</span>
                      </div>
                      <UProgress :value="(Number(indicator.value) / Number(indicator.target)) * 100" />
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 mx-auto opacity-40 mb-3" />
                  <p>Aucun indicateur défini</p>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Onglet Financement -->
          <template #finances>
            <div class="space-y-6 mt-6">
              <UCard>
                <template #header>

<!--                  <pre>-->
<!--                    {{ project }}-->
<!--                  </pre>-->
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Sources de financement</h2>
                    <UButton color="primary" icon="i-heroicons-plus" size="sm">
                      Ajouter un financement
                    </UButton>
                  </div>
                </template>
                <div v-if="project?.finances?.length" class="space-y-4">
                  <div
                    v-for="finance in project.finances"
                    :key="finance.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Donateur</p>
                        <p class="font-semibold">{{ finance.fundingSource?.donor || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Programme</p>
                        <p class="font-semibold">{{ finance.fundingSource?.program || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Montant engagé</p>
                        <p class="font-semibold text-green-600">{{ finance.amountCommitedCfa }} {{ finance.currency }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Montant déboursé</p>
                        <p class="font-semibold text-blue-600">{{ finance.amountDisbursedCfa }} {{ finance.currency }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <UIcon name="i-heroicons-currency-dollar" class="w-12 h-12 mx-auto opacity-40 mb-3" />
                  <p>Aucun financement enregistré</p>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Onglet Partenaires -->
          <template #partners>
            <div class="space-y-6 mt-6">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Partenaires du projet</h2>
                    <UButton color="primary" icon="i-heroicons-plus" size="sm">
                      Ajouter un partenaire
                    </UButton>
                  </div>
                </template>
                <div v-if="project?.partners?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="partner in project.partners"
                    :key="partner.id"
                    class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-building-office-2" class="w-6 h-6" />
                      </div>
                      <div>
                        <h4 class="font-semibold">{{ partner.name }}</h4>
                        <UBadge size="xs" color="blue">{{ partner.type }}</UBadge>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400" v-if="partner.otherData?.role">
                      <span class="font-medium">Rôle:</span> {{ partner.otherData.role }}
                    </p>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <UIcon name="i-heroicons-building-office" class="w-12 h-12 mx-auto opacity-40 mb-3" />
                  <p>Aucun partenaire enregistré</p>
                </div>
              </UCard>
            </div>
          </template>

          <!-- Onglet Fichiers -->
          <template #files>
            <div class="space-y-6 mt-6">
              <UCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Fichiers associés</h2>
                    <UButton color="primary" icon="i-heroicons-plus" size="sm">
                      Ajouter un fichier
                    </UButton>
                  </div>
                </template>
                <div v-if="project?.files?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    v-for="file in project.files"
                    :key="file.id"
                    class="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <!-- Prévisualisation du fichier -->
                    <div
                      class="aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden cursor-pointer"
                      @click="previewFile = file; filePreviewModal = true"
                    >
                      <template v-if="getFileType(file?.fileId?.originalName || '') === 'image'">
                        <StreamedImage
                          :file-id="file.fileId.id"
                          :alt="file.fileId.originalName"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </template>
                      <template v-else-if="getFileType(file.fileId?.originalName || '') === 'pdf'">
                        <div class="flex flex-col items-center gap-2">
                          <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-red-500" />
                          <span class="text-sm text-gray-600 dark:text-gray-400">PDF</span>
                        </div>
                      </template>
                      <template v-else>
                        <div class="flex flex-col items-center gap-2">
                          <UIcon :name="getFileIcon(file.fileId?.originalName || '')" class="w-16 h-16 text-gray-400" />
                          <span class="text-sm text-gray-600 dark:text-gray-400">{{ file.fileId?.originalName?.split('.').pop()?.toUpperCase() }}</span>
                        </div>
                      </template>
                    </div>

                    <!-- Informations du fichier -->
                    <div class="p-3">
                      <p class="font-medium text-sm truncate" :title="file.fileId?.originalName">
                        {{ file.fileId?.originalName || 'Sans nom' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ file.fileType?.name || 'Type non spécifié' }}
                      </p>
                      <div class="flex items-center gap-2 mt-3">
                        <UButton
                          icon="i-heroicons-eye"
                          size="xs"
                          color="gray"
                          variant="soft"
                          @click="previewFile = file; filePreviewModal = true"
                        >
                          Voir
                        </UButton>
                        <UButton
                          icon="i-heroicons-arrow-down-tray"
                          size="xs"
                          color="blue"
                          variant="soft"
                          @click="downloadFile(file.fileId?.id, file.fileId?.originalName)"
                        >
                          Télécharger
                        </UButton>
                        <UButton
                          icon="i-heroicons-arrow-top-right-on-square"
                          size="xs"
                          color="gray"
                          variant="ghost"
                          @click="openFileInNewTab(file.fileId?.id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-12 text-gray-500">
                  <UIcon name="i-heroicons-document" class="w-12 h-12 mx-auto opacity-40 mb-3" />
                  <p>Aucun fichier associé</p>
                </div>
              </UCard>
            </div>
          </template>
        </UTabs>
      </div>
    </div>

    <!-- Modal - Affecter un point focal -->
    <UModal v-model="assignFocalPointModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Affecter un point focal</h3>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Point focal" required>
            <UInput
              v-model="focalPointName"
              placeholder="Nom du point focal"
              icon="i-heroicons-user"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="assignFocalPointModal = false">
              Annuler
            </UButton>
            <UButton color="primary" @click="assignFocalPoint">
              Affecter
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Modal - Prévisualisation des fichiers -->
    <UModal v-model="filePreviewModal" :ui="{ width: 'max-w-5xl' }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ previewFile?.fileId?.originalName || 'Prévisualisation' }}</h3>
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                size="sm"
                color="primary"
                @click="downloadFile(previewFile?.fileId?.id, previewFile?.fileId?.originalName)"
              >
                Télécharger
              </UButton>
              <UButton
                icon="i-heroicons-arrow-top-right-on-square"
                size="sm"
                color="gray"
                @click="openFileInNewTab(previewFile?.fileId?.id)"
              >
                Ouvrir
              </UButton>
            </div>
          </div>
        </template>

        <div class="max-h-[70vh] overflow-auto">
          <template v-if="previewFile">
            <!-- Prévisualisation Image -->
            <template v-if="getFileType(previewFile.fileId?.originalName || '') === 'image'">
              <StreamedImage
                :file-id="previewFile.fileId.id"
                :alt="previewFile.fileId.originalName"
                class="w-full h-auto"
                loading="eager"
              />
            </template>

            <!-- Prévisualisation PDF -->
            <template v-else-if="getFileType(previewFile.fileId?.originalName || '') === 'pdf'">
              <iframe
                :src="getFileDisplayUrl(previewFile.fileId?.id)"
                class="w-full h-[70vh]"
                frameborder="0"
              />
            </template>

            <!-- Autres types de fichiers -->
            <template v-else>
              <div class="text-center py-12">
                <UIcon :name="getFileIcon(previewFile.fileId?.originalName || '')" class="w-24 h-24 mx-auto text-gray-400 mb-4" />
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Prévisualisation non disponible pour ce type de fichier
                </p>
                <p class="text-sm text-gray-500 mb-6">
                  {{ previewFile.fileId?.originalName }}
                </p>
                <div class="flex justify-center gap-3">
                  <UButton
                    color="primary"
                    icon="i-heroicons-arrow-down-tray"
                    @click="downloadFile(previewFile.fileId?.id, previewFile.fileId?.originalName)"
                  >
                    Télécharger le fichier
                  </UButton>
                  <UButton
                    color="gray"
                    icon="i-heroicons-arrow-top-right-on-square"
                    @click="openFileInNewTab(previewFile.fileId?.id)"
                  >
                    Ouvrir dans un nouvel onglet
                  </UButton>
                </div>
              </div>
            </template>
          </template>
        </div>

        <template #footer>
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-medium">Type:</span> {{ previewFile?.fileType?.name || 'Non spécifié' }}
            </div>
            <UButton color="gray" variant="ghost" @click="filePreviewModal = false">
              Fermer
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>