<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import type {Project} from '~/types';
// Import des composables et utilitaires
import useProjectDetail from '~/composables/project/useProjectDetail';
import { useLoading } from '~/composables/useLoading';
import { useToast } from '~/composables/useToast';

type ProjectStatus = Project['status'];

// Initialisation des utilitaires de routage
const route = useRoute();
const router = useRouter();
const projectId = route.params.id as string;

// Utilisation du composable
const {
  project,
  isLoading,
  error,
  fetchProject,
  updateProjectStatus,
  formatDate,
  getProjectProgress,
  getStatusBadge,
  getDaysRemaining
} = useProjectDetail();

// État local
const activeTab = ref('overview');
const projectStatus = computed<ProjectStatus>(() => project.value?.status || 'DRAFT');
const showUploadModal = ref(false);
const showInviteModal = ref(false);

// Données pour l'onglet Documents
const searchQuery = ref('');
const selectedDocType = ref(null);
const sortBy = ref('newest');
const documentTypes = [
  {id: 'all', label: 'Tous les types'},
  {id: 'pdf', label: 'PDF'},
  {id: 'doc', label: 'Documents'},
  {id: 'xls', label: 'Feuilles de calcul'},
  {id: 'img', label: 'Images'},
];

const sortOptions = [
  {value: 'newest', label: 'Plus récent'},
  {value: 'oldest', label: 'Plus ancien'},
  {value: 'name_asc', label: 'Nom (A-Z)'},
  {value: 'name_desc', label: 'Nom (Z-A)'},
];

// Données pour l'onglet Activités
const activitySearch = ref('');
const selectedActivityType = ref('all');
const activityTypes = [
  {id: 'all', label: 'Toutes les activités'},
  {id: 'create', label: 'Création'},
  {id: 'update', label: 'Mises à jour'},
  {id: 'comment', label: 'Commentaires'},
  {id: 'file', label: 'Fichiers'},
];

// Données pour l'onglet Équipe
const teamSearch = ref('');

// Paramètres de notification
const notificationSettings = ref([
  {id: 'updates', label: 'Mises à jour du projet', enabled: true},
  {id: 'comments', label: 'Nouveaux commentaires', enabled: true},
  {id: 'mentions', label: 'Mentions', enabled: true},
  {id: 'deadlines', label: 'Échéances', enabled: true},
]);

// Données de démonstration pour les documents
interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

const documents = ref<Document[]>([
  {
    id: '1',
    name: 'Rapport d\'avancement Q3 2025.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadedAt: '2025-09-26T02:57:54.211Z',
    uploadedBy: 'Jean Dupont',
  },
  // Ajoutez plus de documents de démonstration si nécessaire
]);

// Données de démonstration pour les activités
interface Activity {
  id: string;
  type: string;
  user: string;
  action: string;
  target: string;
  datetime: string;
}

const activities = ref<Activity[]>([
  {
    id: '1',
    type: 'create',
    user: 'Jean Dupont',
    action: 'a créé le projet',
    target: 'Projet de développement durable',
    datetime: '2025-09-26T02:57:54.211Z',
  },
  // Ajoutez plus d'activités de démonstration si nécessaire
]);

// Données de démonstration pour l'équipe
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
}

const teamMembers = ref<TeamMember[]>([
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    role: 'Chef de projet',
    status: 'active',
    avatar: '',
  },
  // Ajoutez plus de membres d'équipe de démonstration si nécessaire
]);

// Données filtrées
const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = !selectedDocType.value || selectedDocType.value === 'all' || doc.type === selectedDocType.value;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy.value === 'newest') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
    if (sortBy.value === 'oldest') return new Date(a.uploadedAt) - new Date(b.uploadedAt);
    if (sortBy.value === 'name_asc') return a.name.localeCompare(b.name);
    if (sortBy.value === 'name_desc') return b.name.localeCompare(a.name);
    return 0;
  });
});

const filteredActivities = computed(() => {
  return activities.value.filter(activity => {
    const matchesSearch =
        activity.user.toLowerCase().includes(activitySearch.value.toLowerCase()) ||
        activity.action.toLowerCase().includes(activitySearch.value.toLowerCase()) ||
        activity.target.toLowerCase().includes(activitySearch.value.toLowerCase());
    const matchesType = selectedActivityType.value === 'all' || activity.type === selectedActivityType.value;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
});

const filteredTeamMembers = computed(() => {
  return teamMembers.value.filter(member =>
      member.name.toLowerCase().includes(teamSearch.value.toLowerCase()) ||
      member.email.toLowerCase().includes(teamSearch.value.toLowerCase()) ||
      member.role.toLowerCase().includes(teamSearch.value.toLowerCase())
  );
});

interface TeamGroup {
  [key: string]: {
    role: string;
    members: TeamMember[];
  };
}

const groupedTeamMembers = computed<TeamGroup>(() => {
  const groups: TeamGroup = {};
  filteredTeamMembers.value.forEach(member => {
    if (!groups[member.role]) {
      groups[member.role] = {
        role: member.role,
        members: []
      };
    }
    groups[member.role].members.push(member);
  });
  return groups;
});

// Méthodes utilitaires
const getDocumentActions = (doc: Document) => {
  return [
    [
      {
        label: 'Télécharger',
        icon: 'i-heroicons-arrow-down-tray',
        click: () => downloadDocument(doc.id)
      },
      {
        label: 'Renommer',
        icon: 'i-heroicons-pencil',
        click: () => renameDocument(doc.id)
      }
    ],
    [
      {
        label: 'Supprimer',
        icon: 'i-heroicons-trash',
        click: () => deleteDocument(doc.id)
      }
    ]
  ];
};

const getMemberActions = (member: TeamMember) => {
  return [
    [
      {
        label: 'Modifier le rôle',
        icon: 'i-heroicons-user-circle',
        click: () => editMemberRole(member.id)
      },
      {
        label: 'Envoyer un message',
        icon: 'i-heroicons-envelope',
        click: () => messageMember(member.id)
      }
    ],
    [
      {
        label: 'Retirer du projet',
        icon: 'i-heroicons-user-minus',
        click: () => removeMember(member.id)
      }
    ]
  ];
};

const getActivityColor = (type) => {
  const colors = {
    create: 'bg-green-500',
    update: 'bg-blue-500',
    comment: 'bg-yellow-500',
    file: 'bg-purple-500',
    delete: 'bg-red-500',
  };
  return colors[type] || 'bg-gray-500';
};

// Méthodes pour les actions
const downloadDocument = async (id: string) => {
  const doc = documents.value.find(d => d.id === id);
  if (!doc) return;
  
  const loading = useLoading();
  
  try {
    // Afficher un indicateur de chargement
    loading.start('Téléchargement en cours...');
    
    // Simuler un téléchargement (à remplacer par un appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = `#`; // Remplacer par l'URL de téléchargement réelle
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Ajouter une activité
    activities.value.unshift({
      id: `activity-${Date.now()}`,
      type: 'document',
      user: 'Utilisateur actuel', // Remplacer par l'utilisateur connecté
      action: 'a téléchargé le document',
      target: doc.name,
      datetime: new Date().toISOString()
    });
    
    // Afficher une notification de succès
    useToast().add({
      title: 'Téléchargement réussi',
      description: `Le document "${doc.name}" a été téléchargé avec succès.`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
    
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    useToast().add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors du téléchargement du document.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  } finally {
    loading.finish();
  }
};

const renameDocument = (id) => {
  // Implémentez le renommage du document
  console.log('Renommage du document:', id);
};

const deleteDocument = (id) => {
  // Implémentez la suppression du document
  console.log('Suppression du document:', id);
};

const editMemberRole = (id) => {
  // Implémentez la modification du rôle du membre
  console.log('Modification du rôle du membre:', id);
};

const messageMember = (id) => {
  // Implémentez l'envoi d'un message au membre
  console.log('Envoi d\'un message au membre:', id);
};

const removeMember = (id) => {
  // Implémentez le retrait du membre du projet
  console.log('Retrait du membre du projet:', id);
};

const confirmArchiveProject = () => {
  // Implémentez la confirmation d'archivage du projet
  console.log('Archivage du projet');
};

const confirmDeleteProject = () => {
  // Implémentez la confirmation de suppression du projet
  console.log('Suppression du projet');
};

// Formater les montants en devise
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Gestion des erreurs
const errorMessage = computed(() => {
  if (error.value) {
    // Afficher l'erreur dans une notification toast
    useToast().add({
      title: 'Erreur',
      description: error.value.message || 'Une erreur est survenue',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
      timeout: 10000 // 10 secondes
    });
    return error.value.message || 'Une erreur est survenue';
  }
  if (!project.value) {
    return 'Projet non trouvé';
  }
  return null;
});

// Écouter les changements d'erreur
watch(error, (newError) => {
  if (newError) {
    useToast().add({
      title: 'Erreur',
      description: newError.message || 'Une erreur est survenue lors du chargement du projet',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red',
      timeout: 10000
    });
  }
});

// Données de démonstration (à supprimer une fois l'API implémentée)
const demoProject: Project = {
  id: projectId,
  title: "Projet de développement durable",
  description: "Description détaillée du projet",
  type: {
    id: "type1",
    name: "Eau potable",
    description: "Projets liés à l'accès à l'eau potable"
  },
  status: "PENDING",
  createdBy: "Augustin Bonou",
  createdAt: "2025-09-26T02:57:54.211Z",
  updatedAt: "2025-09-26T02:57:54.211Z",
  coverImage: {
    url: "/images/project-cover.jpg",
    alt: "Image de couverture du projet"
  },
  startDate: "2025-01-01T00:00:00.000Z",
  endDate: "2025-12-31T00:00:00.000Z",
  objective: {
    goal: "Améliorer l'accès à l'eau potable"
  },
  expectedResults: {
    result: "1000 personnes avec accès à l'eau"
  },
  totalBudget: 1500000,
  location: {
    region: "Atlantique",
    city: "Calavi",
    coordinates: [2.4604, 6.363]
  },
  indicators: [
    {
      id: "ind-1",
      name: "Nombre de bénéficiaires",
      value: "500",
      target: "1000",
      unit: "personnes"
    }
  ],
  finances: [
    {
      id: "f1",
      fundingSource: "Banque mondiale",
      amountCommitedCfa: 100000000,
      amountDisbursedCfa: 50000000,
      currency: "FCFA"
    }
  ],
  files: [
    {
      id: "file-1",
      name: "Rapport de projet",
      type: "pdf",
      size: "1.2 MB",
      uploadedAt: "2025-09-26T02:57:54.211Z"
    }
  ]
};

// Mettre à jour le statut du projet
const updateStatus = async (status: ProjectStatus) => {
  try {
    const loading = useLoading();
    loading.start('Mise à jour du statut...');
    
    await updateProjectStatus(status);
    
    // Recharger les données du projet
    await fetchProject(projectId);
    
    // Déterminer le libellé du statut pour le message
    const statusLabels: Record<string, string> = {
      'DRAFT': 'brouillon',
      'PENDING': 'en attente',
      'PUBLISHED': 'publié',
      'REJECTED': 'rejeté'
    };
    
    // Ajouter une activité
    activities.value.unshift({
      id: `status-${Date.now()}`,
      type: 'update',
      user: 'Système',
      action: 'Le statut du projet a été mis à jour:',
      target: statusLabels[status] || status,
      datetime: new Date().toISOString()
    });
    
    // Afficher une notification de succès
    useToast().add({
      title: 'Statut mis à jour',
      description: `Le projet a été marqué comme ${statusLabels[status] || status}.`,
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
    
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err);
    
    // Afficher une notification d'erreur
    useToast().add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la mise à jour du statut du projet.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  } finally {
    useLoading().finish();
  }
};

// Charger les données du projet au montage du composant
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

// Charger le projet au montage du composant
onMounted(() => {
  loadProject();
});

// Recharger le projet quand l'ID change
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadProject();
  }
});

// Recharger les données lorsque l'ID du projet change
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchProject(newId as string);
  }
});

// Actions du projet
const projectActions = [
  {
    label: 'Modifier',
    icon: 'i-heroicons-pencil-square',
    click: () => navigateTo(`/project-module/${projectId}/edit`)
  },
  {
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: async () => {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
        // Implémentez la logique de suppression ici
        await router.push('/project-module');
      }
    }
  },
  {
    label: 'Publier',
    icon: 'i-heroicons-arrow-up-tray',
    click: () => updateStatus('PUBLISHED'),
    disabled: computed(() => projectStatus.value === 'PUBLISHED')
  },
  {
    label: 'Rejeter',
    icon: 'i-heroicons-x-circle',
    click: () => updateStatus('REJECTED'),
    disabled: computed(() => projectStatus.value === 'REJECTED')
  },
  {
    label: 'Exporter en PDF',
    icon: 'i-heroicons-document-arrow-down',
    click: () => {
      // Logique d'export PDF
      alert('Export PDF en cours de développement');
    }
  }
];

// Onglets de navigation
const tabs = [
  {id: 'overview', label: 'Aperçu', icon: 'i-heroicons-home'},
  {id: 'indicators', label: 'Indicateurs', icon: 'i-heroicons-chart-bar'},
  {id: 'finances', label: 'Financement', icon: 'i-heroicons-currency-dollar'},
  {id: 'documents', label: 'Documents', icon: 'i-heroicons-document'},
  {id: 'activity', label: 'Activités', icon: 'i-heroicons-clock'},
  {id: 'team', label: 'Équipe', icon: 'i-heroicons-user-group'},
  {id: 'settings', label: 'Paramètres', icon: 'i-heroicons-cog-6-tooth'}
];

// Fonction pour obtenir le badge de statut
const getStatusBadges = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, { color: string, label: string }> = {
    'DRAFT': {color: 'gray', label: 'Brouillon'},
    'PENDING': {color: 'yellow', label: 'En attente'},
    'PUBLISHED': {color: 'green', label: 'Publié'},
    'REJECTED': {color: 'red', label: 'Rejeté'},
  };
  return statusMap[status] || {color: 'gray', label: 'Inconnu'};
};

// Fonction pour obtenir l'icône d'un type de fichier
const getFileIcon = (fileType: string) => {
  const iconMap: Record<string, string> = {
    'pdf': 'i-heroicons-document-text',
    'doc': 'i-heroicons-document',
    'docx': 'i-heroicons-document',
    'xls': 'i-heroicons-table-cells',
    'xlsx': 'i-heroicons-table-cells',
    'ppt': 'i-heroicons-presentation-chart-bar',
    'pptx': 'i-heroicons-presentation-chart-bar',
    'jpg': 'i-heroicons-photo',
    'jpeg': 'i-heroicons-photo',
    'png': 'i-heroicons-photo',
    'gif': 'i-heroicons-photo',
    'zip': 'i-heroicons-archive-box',
    'rar': 'i-heroicons-archive-box',
    'txt': 'i-heroicons-document-text',
    'csv': 'i-heroicons-document-chart-bar',
  };

  return iconMap[fileType.toLowerCase()] || 'i-heroicons-document';
};

// Fonction pour obtenir l'icône d'un type d'activité
const getActivityIcon = (activityType: string) => {
  const iconMap: Record<string, string> = {
    'status_change': 'i-heroicons-arrow-path-rounded-square',
    'file_upload': 'i-heroicons-arrow-up-tray',
    'file_download': 'i-heroicons-arrow-down-tray',
    'comment': 'i-heroicons-chat-bubble-left-right',
    'update': 'i-heroicons-pencil-square',
    'create': 'i-heroicons-plus-circle',
    'delete': 'i-heroicons-trash',
  };

  return iconMap[activityType] || 'i-heroicons-bell';
};


// Charger les données au montage du composant
onMounted(() => {
  //loadProject();
});

// Définir le titre de la page
useHead({
  title: computed(() => project.value ? `${project.value.title} - Détails` : 'Chargement...'),
});

definePageMeta({
  layout: "sisep-app-layout",
});

</script>

<template>

  <div class=" bg-gray-50 dark:bg-gray-900">
    <!-- En-tête avec image de couverture et informations principales -->
    <div class="relative">
      <!-- Image de couverture -->
      <div class="h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900">
        <img 
          v-if="project?.coverImage?.url" 
          :src="project.coverImage.url" 
          :alt="project.coverImage.alt || 'Image de couverture du projet'"
          class="w-full h-full object-cover"
        >
      </div>
      
      <!-- Barre d'actions -->
      <div class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-4">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ project?.title || 'Chargement...' }}
              </h1>
              <span :class="getStatusBadge(projectStatus)">
                {{ projectStatus === 'DRAFT' ? 'Brouillon' : 
                   projectStatus === 'PENDING' ? 'En attente' :
                   projectStatus === 'PUBLISHED' ? 'Publié' :
                   projectStatus === 'REJECTED' ? 'Rejeté' : projectStatus }}
              </span>
            </div>
            <div class="flex space-x-2">
              <UDropdown :items="[[projectActions[2]], [projectActions[3]]]" :popper="{ placement: 'bottom-end' }">
                <UButton
                  color="gray"
                  variant="soft"
                  trailing-icon="i-heroicons-ellipsis-horizontal"
                  aria-label="Actions du projet"
                />
              </UDropdown>
              <UButton
                color="primary"
                :icon="projectStatus === 'PUBLISHED' ? 'i-heroicons-pencil' : 'i-heroicons-arrow-up-tray'"
                @click="projectStatus === 'PUBLISHED' ? $router.push(`/project-module/${projectId}/edit`) : updateStatus('PUBLISHED')"
                :disabled="projectStatus === 'PUBLISHED'"
              >
                {{ projectStatus === 'PUBLISHED' ? 'Modifier' : 'Publier' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="lg:flex lg:space-x-8">
        <!-- Colonne principale -->
        <div class="lg:w-2/3 space-y-6">
          <!-- Navigation par onglets -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Contenu des onglets -->
          <div class="space-y-6">
            <!-- Onglet Vue d'ensemble -->
            <div v-if="activeTab === 'overview'">
              <!-- Description -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Description</h2>
                <p class="text-gray-600 dark:text-gray-300">{{ project?.description || 'Aucune description fournie' }}</p>
              </div>

              <!-- Objectifs et résultats attendus -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Objectif principal</h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ project?.objective?.goal || 'Non défini' }}</p>
                </div>
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                  <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Résultats attendus</h3>
                  <p class="text-gray-600 dark:text-gray-300">{{ project?.expectedResults?.result || 'Non définis' }}</p>
                </div>
              </div>

              <!-- Indicateurs -->
              <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Indicateurs</h3>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden">
                  <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                    <li v-for="(indicator, index) in project?.indicators || []" :key="index" class="px-6 py-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ indicator.name }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ indicator.value }} / {{ indicator.target }} {{ indicator.unit }}
                          </p>
                        </div>
                        <div class="w-1/3">
                          <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div 
                              class="bg-blue-600 h-2.5 rounded-full" 
                              :style="{ width: Math.min(100, (Number(indicator.value) / Number(indicator.target)) * 100) + '%' }"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li v-if="!project?.indicators?.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun indicateur défini
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Onglet Documents -->
            <div v-else-if="activeTab === 'documents'">
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Documents du projet</h3>
                  <UButton
                    color="primary"
                    icon="i-heroicons-plus"
                    @click="showUploadModal = true"
                  >
                    Ajouter un document
                  </UButton>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden">
                  <!-- Filtres et tri -->
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                      <div class="flex-1">
                        <UInput
                          v-model="searchQuery"
                          placeholder="Rechercher un document..."
                          icon="i-heroicons-magnifying-glass"
                        />
                      </div>
                      <div class="flex space-x-4">
                        <USelect
                          v-model="selectedDocType"
                          :options="documentTypes"
                          option-attribute="label"
                          placeholder="Type de document"
                          class="w-48"
                        />
                        <USelect
                          v-model="sortBy"
                          :options="sortOptions"
                          option-attribute="label"
                          placeholder="Trier par"
                          class="w-48"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Liste des documents -->
                  <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                    <li v-for="doc in filteredDocuments" :key="doc.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                          <div :class="['flex-shrink-0', getFileIcon(doc.type)]"></div>
                          <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                              {{ doc.size }} • Ajouté le {{ formatDate(doc.uploadedAt) }} par {{ doc.uploadedBy }}
                            </p>
                          </div>
                        </div>
                        <UDropdown :items="getDocumentActions(doc)" :popper="{ placement: 'bottom-end' }">
                          <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-ellipsis-vertical"
                            aria-label="Actions du document"
                          />
                        </UDropdown>
                      </div>
                    </li>
                    <li v-if="!filteredDocuments.length" class="px-6 py-12 text-center">
                      <div class="text-gray-400 dark:text-gray-500">
                        <UIcon name="i-heroicons-document-magnifying-glass" class="h-12 w-12 mx-auto opacity-40" />
                        <p class="mt-2">Aucun document trouvé</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Onglet Équipe -->
            <div v-else-if="activeTab === 'team'">
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Membres de l'équipe</h3>
                  <UButton
                    color="primary"
                    icon="i-heroicons-user-plus"
                    @click="showInviteModal = true"
                  >
                    Inviter un membre
                  </UButton>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden">
                  <!-- Filtre -->
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <UInput
                      v-model="teamSearch"
                      placeholder="Rechercher un membre..."
                      icon="i-heroicons-magnifying-glass"
                    />
                  </div>

                  <!-- Liste des membres par rôle -->
                  <div v-for="(group, role) in groupedTeamMembers" :key="role" class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700">
                      <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ role }}</h4>
                    </div>
                    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                      <li v-for="member in group.members" :key="member.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-4">
                            <UAvatar
                              :src="member.avatar"
                              :alt="member.name"
                              :ui="{ size: { 'md': 'w-10 h-10 text-sm' } }"
                            />
                            <div>
                              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                              <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                            </div>
                          </div>
                          <UDropdown :items="getMemberActions(member)" :popper="{ placement: 'bottom-end' }">
                            <UButton
                              color="gray"
                              variant="ghost"
                              icon="i-heroicons-ellipsis-vertical"
                              aria-label="Actions du membre"
                            />
                          </UDropdown>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div v-if="!Object.keys(groupedTeamMembers).length" class="px-6 py-12 text-center">
                    <div class="text-gray-400 dark:text-gray-500">
                      <UIcon name="i-heroicons-user-group" class="h-12 w-12 mx-auto opacity-40" />
                      <p class="mt-2">Aucun membre dans l'équipe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Onglet Activités -->
            <div v-else-if="activeTab === 'activity'">
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Activités récentes</h3>
                </div>
                <div class="bg-white dark:bg-gray-800 overflow-hidden">
                  <!-- Filtres -->
                  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                      <div class="flex-1">
                        <UInput
                          v-model="activitySearch"
                          placeholder="Rechercher une activité..."
                          icon="i-heroicons-magnifying-glass"
                        />
                      </div>
                      <div>
                        <USelect
                          v-model="selectedActivityType"
                          :options="activityTypes"
                          option-attribute="label"
                          placeholder="Tous les types"
                          class="w-48"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Liste des activités -->
                  <div class="divide-y divide-gray-200 dark:divide-gray-700">
                    <div v-for="activity in filteredActivities" :key="activity.id" class="px-6 py-4">
                      <div class="flex space-x-3">
                        <div class="flex-shrink-0">
                          <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <UIcon :name="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-600 dark:text-blue-300" />
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-gray-900 dark:text-white">
                            <span class="font-medium">{{ activity.user }}</span>
                            <span class="ml-1">{{ activity.action }}</span>
                            <span class="font-medium">{{ activity.target }}</span>
                          </p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            {{ formatDate(activity.datetime) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div v-if="!filteredActivities.length" class="px-6 py-12 text-center">
                      <div class="text-gray-400 dark:text-gray-500">
                        <UIcon name="i-heroicons-document-text" class="h-12 w-12 mx-auto opacity-40" />
                        <p class="mt-2">Aucune activité récente</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Barre latérale -->
        <div class="lg:w-1/3 mt-8 lg:mt-0 space-y-6">
          <!-- Statut et dates -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Détails du projet</h3>
            <dl class="space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  <span :class="getStatusBadge(projectStatus)">
                    {{ projectStatus === 'DRAFT' ? 'Brouillon' : 
                       projectStatus === 'PENDING' ? 'En attente' :
                       projectStatus === 'PUBLISHED' ? 'Publié' :
                       projectStatus === 'REJECTED' ? 'Rejeté' : projectStatus }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Date de début</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.startDate ? formatDate(project.startDate) : 'Non définie' }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Date de fin prévue</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.endDate ? formatDate(project.endDate) : 'Non définie' }}</dd>
              </div>
              <div v-if="project?.location">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Localisation</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ project.location.city }}, {{ project.location.region }}
                </dd>
              </div>
              <div v-if="project?.totalBudget">
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</dt>
                <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(project.totalBudget) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Financement -->
          <div v-if="project?.finances?.length" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Financement</h3>
            <div class="space-y-4">
              <div v-for="(finance, index) in project.finances" :key="index" class="border-l-4 border-blue-500 pl-4">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ finance.fundingSource }}</h4>
                <div class="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Engagé</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(finance.amountCommitedCfa) }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Décaissé</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(finance.amountDisbursedCfa) }}</p>
                  </div>
                </div>
                <div class="mt-2">
                  <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: Math.min(100, (finance.amountDisbursedCfa / finance.amountCommitedCfa) * 100) + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                    {{ Math.round((finance.amountDisbursedCfa / finance.amountCommitedCfa) * 100) }}% décaissé
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Derniers documents -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Derniers documents</h3>
            </div>
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div v-for="doc in documents.slice(0, 3)" :key="doc.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div class="flex items-center space-x-4">
                  <div :class="['flex-shrink-0', getFileIcon(doc.type)]"></div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.name }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(doc.uploadedAt) }}</p>
                  </div>
                </div>
              </div>
              <div v-if="!documents.length" class="px-6 py-12 text-center">
                <div class="text-gray-400 dark:text-gray-500">
                  <UIcon name="i-heroicons-document-text" class="h-8 w-8 mx-auto opacity-40" />
                  <p class="mt-2 text-sm">Aucun document</p>
                </div>
              </div>
              <div v-else class="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700">
                <UButton
                  color="gray"
                  variant="ghost"
                  size="sm"
                  @click="activeTab = 'documents'"
                  label="Voir tous les documents"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <UModal v-model="showUploadModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Téléverser un document</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showUploadModal = false"
              aria-label="Fermer"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Sélectionner un fichier" name="file">
            <UInput type="file" />
          </UFormGroup>
          <UFormGroup label="Type de document" name="documentType">
            <USelect
              v-model="selectedDocType"
              :options="documentTypes.filter(t => t.id !== 'all')"
              option-attribute="label"
              placeholder="Sélectionner un type"
            />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton
              color="gray"
              variant="ghost"
              label="Annuler"
              @click="showUploadModal = false"
            />
            <UButton
              color="primary"
              label="Téléverser"
              @click="showUploadModal = false"
            />
          </div>
        </template>
      </UCard>
    </UModal>

    <UModal v-model="showInviteModal">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Inviter un membre</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark"
              @click="showInviteModal = false"
              aria-label="Fermer"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Adresse e-mail" name="email">
            <UInput v-model="inviteEmail" placeholder="email@example.com" />
          </UFormGroup>
          <UFormGroup label="Rôle" name="role">
            <USelect
              v-model="inviteRole"
              :options="[
                { id: 'admin', label: 'Administrateur' },
                { id: 'editor', label: 'Éditeur' },
                { id: 'viewer', label: 'Lecteur' }
              ]"
              option-attribute="label"
              placeholder="Sélectionner un rôle"
            />
          </UFormGroup>
          <UFormGroup label="Message (optionnel)" name="message">
            <UTextarea v-model="inviteMessage" placeholder="Ajouter un message personnalisé..." />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton
              color="gray"
              variant="ghost"
              label="Annuler"
              @click="showInviteModal = false"
            />
            <UButton
              color="primary"
              label="Envoyer l'invitation"
              @click="sendInvitation"
            />
          </div>
        </template>
      </UCard>
    </UModal>

  </div>

  <div class="hidden">
        <!-- En-tête avec image de couverture et informations principales -->
        <div class="relative">
          <!-- Image de couverture -->
          <div class="h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900">
            <img
              v-if="project?.coverImage?.url"
              :src="project.coverImage.url"
              :alt="project.coverImage.alt || 'Image de couverture du projet'"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Barre d'actions -->
          <div class="bg-white dark:bg-gray-800 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-4">
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ project?.title || 'Chargement...' }}
                  </h1>
                  <span :class="getStatusBadge(projectStatus)">
                    {{ projectStatus === 'DRAFT' ? 'Brouillon' :
                       projectStatus === 'PENDING' ? 'En attente' :
                       projectStatus === 'PUBLISHED' ? 'Publié' :
                       projectStatus === 'REJECTED' ? 'Rejeté' : projectStatus }}
                  </span>
                </div>
                <div class="flex space-x-2">
                  <UDropdown :items="[[projectActions[2]], [projectActions[3]]]" :popper="{ placement: 'bottom-end' }">
                    <UButton
                      color="gray"
                      variant="soft"
                      trailing-icon="i-heroicons-ellipsis-horizontal"
                      aria-label="Actions du projet"
                    />
                  </UDropdown>
                  <UButton
                    color="primary"
                    :icon="projectStatus === 'PUBLISHED' ? 'i-heroicons-pencil' : 'i-heroicons-arrow-up-tray'"
                    @click="projectStatus === 'PUBLISHED' ? $router.push(`/project-module/${projectId}/edit`) : updateStatus('PUBLISHED')"
                    :disabled="projectStatus === 'PUBLISHED'"
                  >
                    {{ projectStatus === 'PUBLISHED' ? 'Modifier' : 'Publier' }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="lg:flex lg:space-x-8">
            <!-- Colonne principale -->
            <div class="lg:w-2/3 space-y-6">
              <!-- Navigation par onglets -->
              <div class="border-b border-gray-200 dark:border-gray-700">
                <nav class="-mb-px flex space-x-8">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    @click="activeTab = tab.id"
                    :class="[
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                    ]"
                  >
                    {{ tab.label }}
                  </button>
                </nav>
              </div>

              <!-- Contenu des onglets -->
              <div class="space-y-6">
                <!-- Onglet Vue d'ensemble -->
                <div v-if="activeTab === 'overview'">
                  <!-- Description -->
                  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Description</h2>
                    <p class="text-gray-600 dark:text-gray-300">{{ project?.description || 'Aucune description fournie' }}</p>
                  </div>

                  <!-- Objectifs et résultats attendus -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Objectif principal</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ project?.objective?.goal || 'Non défini' }}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                      <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Résultats attendus</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ project?.expectedResults?.result || 'Non définis' }}</p>
                    </div>
                  </div>

                  <!-- Indicateurs -->
                  <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Indicateurs</h3>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden">
                      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                        <li v-for="(indicator, index) in project?.indicators || []" :key="index" class="px-6 py-4">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ indicator.name }}</p>
                              <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ indicator.value }} / {{ indicator.target }} {{ indicator.unit }}
                              </p>
                            </div>
                            <div class="w-1/3">
                              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div
                                  class="bg-blue-600 h-2.5 rounded-full"
                                  :style="{ width: Math.min(100, (Number(indicator.value) / Number(indicator.target)) * 100) + '%' }"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li v-if="!project?.indicators?.length" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          Aucun indicateur défini
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Onglet Documents -->
                <div v-else-if="activeTab === 'documents'">
                  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Documents du projet</h3>
                      <UButton
                        color="primary"
                        icon="i-heroicons-plus"
                        @click="showUploadModal = true"
                      >
                        Ajouter un document
                      </UButton>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden">
                      <!-- Filtres et tri -->
                      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                          <div class="flex-1">
                            <UInput
                              v-model="searchQuery"
                              placeholder="Rechercher un document..."
                              icon="i-heroicons-magnifying-glass"
                            />
                          </div>
                          <div class="flex space-x-4">
                            <USelect
                              v-model="selectedDocType"
                              :options="documentTypes"
                              option-attribute="label"
                              placeholder="Type de document"
                              class="w-48"
                            />
                            <USelect
                              v-model="sortBy"
                              :options="sortOptions"
                              option-attribute="label"
                              placeholder="Trier par"
                              class="w-48"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Liste des documents -->
                      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                        <li v-for="doc in filteredDocuments" :key="doc.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                              <div :class="['flex-shrink-0', getFileIcon(doc.type)]"></div>
                              <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.name }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-400">
                                  {{ doc.size }} • Ajouté le {{ formatDate(doc.uploadedAt) }} par {{ doc.uploadedBy }}
                                </p>
                              </div>
                            </div>
                            <UDropdown :items="getDocumentActions(doc)" :popper="{ placement: 'bottom-end' }">
                              <UButton
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-ellipsis-vertical"
                                aria-label="Actions du document"
                              />
                            </UDropdown>
                          </div>
                        </li>
                        <li v-if="!filteredDocuments.length" class="px-6 py-12 text-center">
                          <div class="text-gray-400 dark:text-gray-500">
                            <UIcon name="i-heroicons-document-magnifying-glass" class="h-12 w-12 mx-auto opacity-40" />
                            <p class="mt-2">Aucun document trouvé</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Onglet Équipe -->
                <div v-else-if="activeTab === 'team'">
                  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Membres de l'équipe</h3>
                      <UButton
                        color="primary"
                        icon="i-heroicons-user-plus"
                        @click="showInviteModal = true"
                      >
                        Inviter un membre
                      </UButton>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden">
                      <!-- Filtre -->
                      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <UInput
                          v-model="teamSearch"
                          placeholder="Rechercher un membre..."
                          icon="i-heroicons-magnifying-glass"
                        />
                      </div>

                      <!-- Liste des membres par rôle -->
                      <div v-for="(group, role) in groupedTeamMembers" :key="role" class="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <div class="px-6 py-3 bg-gray-50 dark:bg-gray-700">
                          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ role }}</h4>
                        </div>
                        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                          <li v-for="member in group.members" :key="member.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div class="flex items-center justify-between">
                              <div class="flex items-center space-x-4">
                                <UAvatar
                                  :src="member.avatar"
                                  :alt="member.name"
                                  :ui="{ size: { 'md': 'w-10 h-10 text-sm' } }"
                                />
                                <div>
                                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                                </div>
                              </div>
                              <UDropdown :items="getMemberActions(member)" :popper="{ placement: 'bottom-end' }">
                                <UButton
                                  color="gray"
                                  variant="ghost"
                                  icon="i-heroicons-ellipsis-vertical"
                                  aria-label="Actions du membre"
                                />
                              </UDropdown>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div v-if="!Object.keys(groupedTeamMembers).length" class="px-6 py-12 text-center">
                        <div class="text-gray-400 dark:text-gray-500">
                          <UIcon name="i-heroicons-user-group" class="h-12 w-12 mx-auto opacity-40" />
                          <p class="mt-2">Aucun membre dans l'équipe</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Onglet Activités -->
                <div v-else-if="activeTab === 'activity'">
                  <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                    <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Activités récentes</h3>
                    </div>
                    <div class="bg-white dark:bg-gray-800 overflow-hidden">
                      <!-- Filtres -->
                      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                          <div class="flex-1">
                            <UInput
                              v-model="activitySearch"
                              placeholder="Rechercher une activité..."
                              icon="i-heroicons-magnifying-glass"
                            />
                          </div>
                          <div>
                            <USelect
                              v-model="selectedActivityType"
                              :options="activityTypes"
                              option-attribute="label"
                              placeholder="Tous les types"
                              class="w-48"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Liste des activités -->
                      <div class="divide-y divide-gray-200 dark:divide-gray-700">
                        <div v-for="activity in filteredActivities" :key="activity.id" class="px-6 py-4">
                          <div class="flex space-x-3">
                            <div class="flex-shrink-0">
                              <div class="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <UIcon :name="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-600 dark:text-blue-300" />
                              </div>
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm text-gray-900 dark:text-white">
                                <span class="font-medium">{{ activity.user }}</span>
                                <span class="ml-1">{{ activity.action }}</span>
                                <span class="font-medium">{{ activity.target }}</span>
                              </p>
                              <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formatDate(activity.datetime) }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="!filteredActivities.length" class="px-6 py-12 text-center">
                          <div class="text-gray-400 dark:text-gray-500">
                            <UIcon name="i-heroicons-document-text" class="h-12 w-12 mx-auto opacity-40" />
                            <p class="mt-2">Aucune activité récente</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Barre latérale -->
            <div class="lg:w-1/3 mt-8 lg:mt-0 space-y-6">
              <!-- Statut et dates -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Détails du projet</h3>
                <dl class="space-y-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      <span :class="getStatusBadge(projectStatus)">
                        {{ projectStatus === 'DRAFT' ? 'Brouillon' :
                           projectStatus === 'PENDING' ? 'En attente' :
                           projectStatus === 'PUBLISHED' ? 'Publié' :
                           projectStatus === 'REJECTED' ? 'Rejeté' : projectStatus }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Date de début</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.startDate ? formatDate(project.startDate) : 'Non définie' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Date de fin prévue</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ project?.endDate ? formatDate(project.endDate) : 'Non définie' }}</dd>
                  </div>
                  <div v-if="project?.location">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Localisation</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ project.location.city }}, {{ project.location.region }}
                    </dd>
                  </div>
                  <div v-if="project?.totalBudget">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</dt>
                    <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(project.totalBudget) }}
                    </dd>
                  </div>
                </dl>
              </div>

              <!-- Financement -->
              <div v-if="project?.finances?.length" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Financement</h3>
                <div class="space-y-4">
                  <div v-for="(finance, index) in project.finances" :key="index" class="border-l-4 border-blue-500 pl-4">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ finance.fundingSource }}</h4>
                    <div class="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Engagé</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(finance.amountCommitedCfa) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Décaissé</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(finance.amountDisbursedCfa) }}</p>
                      </div>
                    </div>
                    <div class="mt-2">
                      <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          class="bg-blue-600 h-2 rounded-full"
                          :style="{ width: Math.min(100, (finance.amountDisbursedCfa / finance.amountCommitedCfa) * 100) + '%' }"
                        ></div>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                        {{ Math.round((finance.amountDisbursedCfa / finance.amountCommitedCfa) * 100) }}% décaissé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Derniers documents -->
              <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Derniers documents</h3>
                </div>
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div v-for="doc in documents.slice(0, 3)" :key="doc.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div class="flex items-center space-x-4">
                      <div :class="['flex-shrink-0', getFileIcon(doc.type)]"></div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ doc.name }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(doc.uploadedAt) }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="!documents.length" class="px-6 py-12 text-center">
                    <div class="text-gray-400 dark:text-gray-500">
                      <UIcon name="i-heroicons-document-text" class="h-8 w-8 mx-auto opacity-40" />
                      <p class="mt-2 text-sm">Aucun document</p>
                    </div>
                  </div>
                  <div v-else class="px-6 py-4 text-center border-t border-gray-200 dark:border-gray-700">
                    <UButton
                      color="gray"
                      variant="ghost"
                      size="sm"
                      @click="activeTab = 'documents'"
                      label="Voir tous les documents"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modales -->
        <UModal v-model="showUploadModal">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Téléverser un document</h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="showUploadModal = false"
                  aria-label="Fermer"
                />
              </div>
            </template>

            <div class="space-y-4">
              <UFormGroup label="Sélectionner un fichier" name="file">
                <UInput type="file" />
              </UFormGroup>
              <UFormGroup label="Type de document" name="documentType">
                <USelect
                  v-model="selectedDocType"
                  :options="documentTypes.filter(t => t.id !== 'all')"
                  option-attribute="label"
                  placeholder="Sélectionner un type"
                />
              </UFormGroup>
            </div>

            <template #footer>
              <div class="flex justify-end space-x-3">
                <UButton
                  color="gray"
                  variant="ghost"
                  label="Annuler"
                  @click="showUploadModal = false"
                />
                <UButton
                  color="primary"
                  label="Téléverser"
                  @click="showUploadModal = false"
                />
              </div>
            </template>
          </UCard>
        </UModal>

        <UModal v-model="showInviteModal">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Inviter un membre</h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark"
                  @click="showInviteModal = false"
                  aria-label="Fermer"
                />
              </div>
            </template>

            <div class="space-y-4">
              <UFormGroup label="Adresse e-mail" name="email">
                <UInput v-model="inviteEmail" placeholder="email@example.com" />
              </UFormGroup>
              <UFormGroup label="Rôle" name="role">
                <USelect
                  v-model="inviteRole"
                  :options="[
                    { id: 'admin', label: 'Administrateur' },
                    { id: 'editor', label: 'Éditeur' },
                    { id: 'viewer', label: 'Lecteur' }
                  ]"
                  option-attribute="label"
                  placeholder="Sélectionner un rôle"
                />
              </UFormGroup>
              <UFormGroup label="Message (optionnel)" name="message">
                <UTextarea v-model="inviteMessage" placeholder="Ajouter un message personnalisé..." />
              </UFormGroup>
            </div>

            <template #footer>
              <div class="flex justify-end space-x-3">
                <UButton
                  color="gray"
                  variant="ghost"
                  label="Annuler"
                  @click="showInviteModal = false"
                />
                <UButton
                  color="primary"
                  label="Envoyer l'invitation"
                  @click="sendInvitation"
                />
              </div>
            </template>
          </UCard>
        </UModal>

        <!-- En-tête -->
        <div class="relative bg-white dark:bg-gray-800 shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="py-6 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <UButton
                    class="mr-2"
                    color="gray"
                    icon="i-heroicons-arrow-left"
                    variant="ghost"
                    @click="router.push('/project-module')"
                />
                <div>
                  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ project?.title || 'Chargement...' }}
                  </h1>
                  <div class="flex items-center mt-1 space-x-2">
                    <UBadge
                        v-if="project?.status"
                        :color="getStatusBadge(project.status).color"
                        class="capitalize"
                        size="sm"
                        variant="subtle"
                    >
                      {{ getStatusBadge(project.status).label }}
                    </UBadge>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Dernière mise à jour le {{ project ? formatDate(project.updatedAt) : '...' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <UButton
                    :ui="{ rounded: 'rounded-full' }"
                    color="gray"
                    icon="i-heroicons-ellipsis-horizontal"
                    variant="outline"
                >
                  <UDropdown :items="[projectActions]" :popper="{ placement: 'bottom-end' }">
                    <UButton
                        color="gray"
                        icon="i-heroicons-ellipsis-vertical"
                        variant="ghost"
                    />
                  </UDropdown>
                </UButton>
                <UButton
                    :to="`/project-module/${projectId}/edit`"
                    color="primary"
                    icon="i-heroicons-pencil"
                    label="Modifier"
                />
              </div>
            </div>

            {{activeTab}}

            <pre>
              {{ project }}
            </pre>

            <!-- Barre d'onglets -->
            <div class="border-b border-gray-200 dark:border-gray-700">
              <nav class="-mb-px flex space-x-8">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    :class="[
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                    @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          <div v-if="isLoading" class="flex justify-center py-12">
            <div class="text-center">
              <UIcon class="h-8 w-8 animate-spin text-primary-500 mx-auto" name="i-heroicons-arrow-path"/>
              <p class="mt-2 text-sm text-gray-500">Chargement du projet...</p>
            </div>
          </div>

          <div v-else-if="!project" class="text-center py-12">
            <UIcon class="h-12 w-12 text-gray-400 mx-auto" name="i-heroicons-exclamation-circle"/>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Projet non trouvé</h3>
            <p class="mt-1 text-sm text-gray-500">Le projet demandé n'existe pas ou a été supprimé.</p>
            <div class="mt-6">
              <UButton
                  color="primary"
                  icon="i-heroicons-arrow-left"
                  to="/project-module"
                  variant="solid"
              >
                Retour à la liste des projets
              </UButton>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- Aperçu du projet -->
            <div v-if="activeTab === 'overview'" class="space-y-6">
              <!-- Bannière et image de couverture -->
              <div class="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 h-48">
                <img
                    :alt="project.title"
                    :src="project.coverImage?.url || 'https://placehold.co/1200x300/3b82f6/ffffff?text=' + project.title"
                    class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-6 text-white">
                  <h2 class="text-2xl font-bold">{{ project.title }}</h2>
                  <p class="mt-1 text-gray-200">{{ project.type?.name || 'Sans catégorie' }}</p>
                </div>
              </div>

              <!-- Grille d'informations -->
              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <!-- Colonne de gauche -->
                <div class="md:col-span-2 space-y-6">
                  <!-- Description -->
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                    </template>
                    <p class="text-gray-600 dark:text-gray-300">
                      {{ project.description || 'Aucune description fournie.' }}
                    </p>
                  </UDashboardCard>

                  <!-- Objectifs et résultats attendus -->
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Objectifs et résultats</h3>
                    </template>
                    <div class="space-y-4">
                      <div>
                        <h4 class="font-medium text-gray-700 dark:text-gray-200">Objectif principal</h4>
                        <p class="text-gray-600 dark:text-gray-400">
                          {{ project.objective?.goal || 'Non spécifié' }}
                        </p>
                      </div>
                      <div>
                        <h4 class="font-medium text-gray-700 dark:text-gray-200">Résultats attendus</h4>
                        <p class="text-gray-600 dark:text-gray-400">
                          {{ project.expectedResults?.result || 'Non spécifié' }}
                        </p>
                      </div>
                    </div>
                  </UDashboardCard>

                  <!-- Localisation -->
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Localisation</h3>
                    </template>
                    <div class="space-y-2">
                      <div class="flex items-center text-gray-600 dark:text-gray-300">
                        <UIcon class="w-5 h-5 mr-2 text-gray-400" name="i-heroicons-map-pin"/>
                        <span>{{ project.location?.city }}, {{ project.location?.region }}</span>
                      </div>
                      <div class="mt-4 h-48 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                        <!-- Carte intégrée (à implémenter avec une bibliothèque de cartes) -->
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                          <UIcon class="w-12 h-12" name="i-heroicons-map"/>
                          <span class="ml-2">Carte de localisation</span>
                        </div>
                      </div>
                    </div>
                  </UDashboardCard>
                </div>

                <!-- Colonne de droite -->
                <div class="space-y-6">
                  <!-- Statut et dates -->
                  <UDashboardCard>
                    <div class="space-y-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</h4>
                        <div class="mt-1">
                          <UBadge
                              :color="getStatusBadge(project.status).color"
                              class="text-sm"
                              size="lg"
                              variant="subtle"
                          >
                            {{ getStatusBadge(project.status).label }}
                          </UBadge>
                        </div>
                      </div>

                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Période</h4>
                        <p class="mt-1 text-sm text-gray-900 dark:text-white">
                          Du {{ formatDate(project.startDate) }} au {{ formatDate(project.endDate) }}
                        </p>
                        <div class="mt-2">
                          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Début</span>
                            <span>Fin</span>
                          </div>
                          <UProgress
                              :value="getProjectProgress(project)"
                              class="w-full"
                              color="primary"
                              size="sm"
                          />
                          <div class="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                            {{ getProjectProgress(project) }}% complété
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</h4>
                        <p class="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                          {{ formatCurrency(project.totalBudget) }}
                        </p>
                      </div>
                    </div>
                  </UDashboardCard>

                  <!-- Partenaires -->
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Partenaires</h3>
                    </template>
                    <div class="space-y-3">
                      <div
                          v-for="partner in project.partners || []"
                          :key="partner.id"
                          class="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        <UAvatar
                            :text="partner.name.split(' ').map(n => n[0]).join('').toUpperCase()"
                            :ui="{ rounded: 'rounded-lg' }"
                            size="md"
                        />
                        <div class="min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ partner.name }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ partner.type }}
                          </p>
                        </div>
                      </div>
                      <p v-if="!project.partners?.length" class="text-sm text-gray-500 text-center py-2">
                        Aucun partenaire renseigné
                      </p>
                    </div>
                  </UDashboardCard>
                </div>
              </div>
            </div>

            <!-- Indicateurs -->
            <div v-else-if="activeTab === 'indicators'" class="space-y-6">
              <UDashboardCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Indicateurs de performance</h3>
                    <UButton
                        color="primary"
                        icon="i-heroicons-plus"
                        label="Ajouter un indicateur"
                        size="sm"
                        variant="solid"
                    />
                  </div>
                </template>

                <div class="space-y-6">
                  <div
                      v-for="indicator in project.indicators || []"
                      :key="indicator.id"
                      class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          {{ indicator.indicatorName }}
                        </h4>
                        <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Valeur de base: {{ indicator.baselineValue }} {{ indicator.unit || '' }}</span>
                          <span>•</span>
                          <span>Cible: {{ indicator.targetValue }} {{ indicator.unit || '' }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {{ indicator.latestValue }} {{ indicator.unit || '' }}
                        </div>
                        <div class="text-xs text-gray-500">Dernière mise à jour</div>
                      </div>
                    </div>

                    <div class="mt-4">
                      <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>
                          {{ Math.round((indicator.latestValue / indicator.targetValue) * 100) }}%
                        </span>
                      </div>
                      <UProgress
                          :value="(indicator.latestValue / indicator.targetValue) * 100"
                          class="w-full"
                          color="green"
                          size="xs"
                      />
                    </div>

                    <div class="mt-3 flex justify-end space-x-2">
                      <UButton
                          color="gray"
                          icon="i-heroicons-pencil"
                          label="Modifier"
                          size="xs"
                          variant="ghost"
                      />
                      <UButton
                          color="red"
                          icon="i-heroicons-trash"
                          label="Supprimer"
                          size="xs"
                          variant="ghost"
                      />
                    </div>
                  </div>

                  <div
                      v-if="!project.indicators?.length"
                      class="text-center py-8 text-gray-500"
                  >
                    <UIcon class="mx-auto h-12 w-12 text-gray-300" name="i-heroicons-chart-bar"/>
                    <h3 class="mt-2 text-sm font-medium">Aucun indicateur</h3>
                    <p class="mt-1 text-sm">Commencez par ajouter un indicateur pour suivre les progrès de votre projet.</p>
                    <div class="mt-4">
                      <UButton
                          color="primary"
                          icon="i-heroicons-plus"
                          label="Ajouter un indicateur"
                          variant="solid"
                      />
                    </div>
                  </div>
                </div>
              </UDashboardCard>
            </div>

            <!-- Activités -->
            <div v-else-if="activeTab === 'activity'" class="space-y-6">
              <UDashboardCard>
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Activités récentes</h3>
                    <UButton
                        color="primary"
                        icon="i-heroicons-plus"
                        label="Ajouter une activité"
                        size="sm"
                        variant="solid"
                    />
                  </div>
                </template>

                <div class="space-y-6">
                  <div
                      v-for="activity in project.activities || []"
                      :key="activity.id"
                      class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div class="flex items-start justify-between">
                      <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">
                          {{ activity.activityName }}
                        </h4>
                        <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>Date de début: {{ formatDate(activity.startDate) }}</span>
                          <span>•</span>
                          <span>Date de fin: {{ formatDate(activity.endDate) }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {{ activity.status }}
                        </div>
                        <div class="text-xs text-gray-500">Dernière mise à jour</div>
                      </div>
                    </div>

                    <div class="mt-4">
                      <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>
                          {{ Math.round((activity.progress / 100) * 100) }}%
                        </span>
                      </div>
                      <UProgress
                          :value="activity.progress"
                          class="w-full"
                          color="green"
                          size="xs"
                      />
                    </div>

                    <div class="mt-3 flex justify-end space-x-2">
                      <UButton
                          color="gray"
                          icon="i-heroicons-pencil"
                          label="Modifier"
                          size="xs"
                          variant="ghost"
                      />
                      <UButton
                          color="red"
                          icon="i-heroicons-trash"
                          label="Supprimer"
                          size="xs"
                          variant="ghost"
                      />
                    </div>
                  </div>

                  <div
                      v-if="!project.activities?.length"
                      class="text-center py-8 text-gray-500"
                  >
                    <UIcon class="mx-auto h-12 w-12 text-gray-300" name="i-heroicons-chart-bar"/>
                    <h3 class="mt-2 text-sm font-medium">Aucune activité</h3>
                    <p class="mt-1 text-sm">Commencez par ajouter une activité pour suivre les progrès de votre projet.</p>
                    <div class="mt-4">
                      <UButton
                          color="primary"
                          icon="i-heroicons-plus"
                          label="Ajouter une activité"
                          variant="solid"
                      />
                    </div>
                  </div>
                </div>
              </UDashboardCard>
            </div>

            <!-- Documents -->
            <div v-else-if="activeTab === 'documents'" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <!-- Récapitulatif financier -->
                <div class="md:col-span-1">
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Documents</h3>
                    </template>
                    <div class="space-y-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Liste des documents</h4>
                        <ul>
                          <li v-for="document in project.documents || []" :key="document.id">
                            {{ document.name }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </UDashboardCard>
                </div>
              </div>
            </div>

            <!-- Financement -->
            <div v-else-if="activeTab === 'finances'" class="space-y-6">

              <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                <!-- Récapitulatif financier -->
                <div class="md:col-span-1">
                  <UDashboardCard>
                    <template #header>
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Récapitulatif</h3>
                    </template>
                    <div class="space-y-4">
                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Budget total</h4>
                        <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                          {{ formatCurrency(project.totalBudget) }}
                        </p>
                      </div>

                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Dépensé à ce jour</h4>
                        <p class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                          {{
                            formatCurrency(project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) || 0)
                          }}
                        </p>
                      </div>

                      <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Taux d'exécution</h4>
                        <div class="mt-1">
                          <UProgress
                              :value="(project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) / project.totalBudget) * 100"
                              class="w-full"
                              color="green"
                              size="sm"
                          />
                          <div class="mt-1 text-xs text-right text-gray-500">
                            {{
                              Math.round((project.finances?.reduce((sum, f) => sum + parseFloat(f.amountDisbursedCfa || 0), 0) / project.totalBudget) * 100)
                            }}% du budget utilisé
                          </div>
                        </div>
                      </div>
                    </div>
                  </UDashboardCard>

                  <div class="mt-6">
                    <UDashboardCard>
                      <template #header>
                        <div class="flex items-center justify-between">
                          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Répartition par source</h3>
                          <UButton
                              color="primary"
                              icon="i-heroicons-plus"
                              label="Ajouter"
                              size="xs"
                              variant="ghost"
                          />
                        </div>
                      </template>

                      <div class="space-y-4">
                        <div v-if="!project.finances?.length" class="text-center py-4 text-gray-500">
                          Aucune source de financement renseignée
                        </div>

                        <div v-for="(finance, index) in project.finances || []" :key="index" class="space-y-2">
                          <div class="flex justify-between text-sm">
                            <span class="font-medium text-gray-700 dark:text-gray-300">{{ finance.fundingSource }}</span>
                            <span class="font-medium">{{
                                formatCurrency(parseFloat(finance.amountCommitedCfa || 0))
                              }}</span>
                          </div>
                          <UProgress
                              :value="(parseFloat(finance.amountDisbursedCfa || 0) / parseFloat(finance.amountCommitedCfa || 1)) * 100"
                              class="w-full"
                              color="blue"
                              size="xs"
                          />
                          <div class="flex justify-between text-xs text-gray-500">
                            <span>Décaissé: {{ formatCurrency(parseFloat(finance.amountDisbursedCfa || 0)) }}</span>
                            <span>{{
                                Math.round((parseFloat(finance.amountDisbursedCfa || 0) / parseFloat(finance.amountCommitedCfa || 1)) * 100)
                              }}%</span>
                          </div>
                        </div>
                      </div>
                    </UDashboardCard>
                  </div>
                </div>


              </div>
            </div>

            <!-- Onglet Paramètres -->
            <div v-else-if="activeTab === 'settings'" class="space-y-6">

              <div>
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Paramètres du projet</h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Gérez les paramètres et les préférences de ce
                  projet</p>
              </div>

              dd

              <div class="space-y-8">
                <!-- Informations générales -->
                <UDashboardCard>
                  <template #header>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Informations générales</h3>
                  </template>

                  <div class="space-y-4">
                    <UFormGroup label="Nom du projet" name="name">
                      <UInput v-model="project.title"/>
                    </UFormGroup>

                    <UFormGroup label="Description" name="description">
                      <UTextarea v-model="project.description" rows="3"/>
                    </UFormGroup>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <UFormGroup label="Date de début" name="startDate">
                        <UInput v-model="project.startDate" type="date"/>
                      </UFormGroup>
                      <UFormGroup label="Date de fin" name="endDate">
                        <UInput v-model="project.endDate" type="date"/>
                      </UFormGroup>
                    </div>

                    <div class="pt-4 flex justify-end">
                      <UButton color="primary">Enregistrer les modifications</UButton>
                    </div>
                  </div>
                </UDashboardCard>

                <!-- Paramètres avancés -->
                <UDashboardCard>
                  <template #header>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">Paramètres avancés</h3>
                  </template>

                  <div class="space-y-6">
                    <UFormGroup description="Qui peut voir ce projet ?" label="Visibilité">
                      <USelect
                          v-model="project.visibility"
                          :options="[
                          { value: 'private', label: 'Privé - Seulement les membres de l\'équipe' },
                          { value: 'public', label: 'Public - Visible par tous les utilisateurs' },
                          { value: 'restricted', label: 'Restreint - Visible par certains utilisateurs' },
                        ]"
                      />
                    </UFormGroup>

                    <UFormGroup description="Recevoir des notifications pour ce projet" label="Notifications">
                      <div class="space-y-2">
                        <UCheckbox
                            v-for="notification in notificationSettings"
                            :key="notification.id"
                            v-model="notification.enabled"
                            :label="notification.label"
                        />
                      </div>
                    </UFormGroup>

                    <UDivider/>

                    <div>
                      <h4 class="text-sm font-medium text-red-600 dark:text-red-400">Zone dangereuse</h4>
                      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Ces actions sont irréversibles. Soyez
                        certain
                        de ce que vous faites.</p>

                      <div class="mt-4 space-y-4">
                        <UButton
                            color="red"
                            icon="i-heroicons-archive-box"
                            label="Archiver le projet"
                            variant="outline"
                            @click="confirmArchiveProject"
                        />

                        <UButton
                            color="red"
                            icon="i-heroicons-trash"
                            label="Supprimer le projet"
                            variant="outline"
                            @click="confirmDeleteProject"
                        />
                      </div>
                    </div>
                  </div>
                </UDashboardCard>
              </div>
            </div>

          </div>

        </main>

    </div>

</template>
