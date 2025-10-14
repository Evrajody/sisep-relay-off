<template>
  <div class="project-actions">
    <h3>Actions disponibles pour ce projet</h3>

    <!-- Section : Actions de base -->
    <div v-if="canUpdate || canDelete || canAssign" class="action-section">
      <h4>Actions de gestion</h4>

      <button v-if="canUpdate" @click="handleUpdate" class="btn-primary">
        <Icon name="mdi:pencil" />
        Modifier
      </button>

      <button v-if="canDelete" @click="handleDelete" class="btn-danger">
        <Icon name="mdi:delete" />
        Supprimer
      </button>

      <button v-if="canAssign" @click="handleAssign" class="btn-secondary">
        <Icon name="mdi:account-arrow-right" />
        Affecter
      </button>
    </div>

    <!-- Section : Actions de validation -->
    <div
      v-if="canValidate || canReject || canRequestChange"
      class="action-section"
    >
      <h4>Actions de validation</h4>

      <button v-if="canValidate" @click="handleValidate" class="btn-success">
        <Icon name="mdi:check-circle" />
        Valider
      </button>

      <button v-if="canReject" @click="handleReject" class="btn-danger">
        <Icon name="mdi:close-circle" />
        Rejeter
      </button>

      <button
        v-if="canRequestChange"
        @click="handleRequestChange"
        class="btn-warning"
      >
        <Icon name="mdi:comment-edit" />
        Demander une modification
      </button>
    </div>

    <!-- Section : Actions de publication -->
    <div v-if="canPublish || canUnpublish" class="action-section">
      <h4>Actions de publication</h4>

      <button
        v-if="canPublish && !project.published"
        @click="handlePublish"
        class="btn-primary"
      >
        <Icon name="mdi:publish" />
        Publier
      </button>

      <button
        v-if="canUnpublish && project.published"
        @click="handleUnpublish"
        class="btn-secondary"
      >
        <Icon name="mdi:publish-off" />
        Dépublier
      </button>
    </div>

    <!-- Aucune action disponible -->
    <div v-if="!hasAnyAction" class="no-actions">
      <p>Vous n'avez pas les permissions nécessaires pour effectuer des actions sur ce projet.</p>
    </div>

    <!-- Affichage des rôles (debug) -->
    <div v-if="showDebug" class="debug-info">
      <h4>Informations de débogage</h4>
      <details>
        <summary>Rôles et permissions</summary>
        <pre>{{ debugInfo }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAbilities } from "~/composables/useAbilities";

interface Props {
  project: {
    id: string;
    published: boolean;
    [key: string]: any;
  };
  showDebug?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDebug: false,
});

// Récupérer les abilities de l'utilisateur
const {
  canUpdate,
  canDelete,
  canAssign,
  canValidate,
  canReject,
  canRequestChange,
  canPublish,
  canUnpublish,
  abilities,
} = useAbilities();

// Vérifier si l'utilisateur a au moins une action disponible
const hasAnyAction = computed(
  () =>
    canUpdate.value ||
    canDelete.value ||
    canAssign.value ||
    canValidate.value ||
    canReject.value ||
    canRequestChange.value ||
    canPublish.value ||
    canUnpublish.value
);

// Informations de débogage
const debugInfo = computed(() => ({
  abilities: abilities.value,
  availableActions: {
    canUpdate: canUpdate.value,
    canDelete: canDelete.value,
    canAssign: canAssign.value,
    canValidate: canValidate.value,
    canReject: canReject.value,
    canRequestChange: canRequestChange.value,
    canPublish: canPublish.value,
    canUnpublish: canUnpublish.value,
  },
}));

// Handlers
const handleUpdate = () => {
  console.log("Modifier le projet", props.project.id);
  // Implémenter la logique de modification
};

const handleDelete = () => {
  console.log("Supprimer le projet", props.project.id);
  // Implémenter la logique de suppression
};

const handleAssign = () => {
  console.log("Affecter le projet", props.project.id);
  // Implémenter la logique d'affectation
};

const handleValidate = () => {
  console.log("Valider le projet", props.project.id);
  // Implémenter la logique de validation
};

const handleReject = () => {
  console.log("Rejeter le projet", props.project.id);
  // Implémenter la logique de rejet
};

const handleRequestChange = () => {
  console.log("Demander une modification du projet", props.project.id);
  // Implémenter la logique de demande de modification
};

const handlePublish = () => {
  console.log("Publier le projet", props.project.id);
  // Implémenter la logique de publication
};

const handleUnpublish = () => {
  console.log("Dépublier le projet", props.project.id);
  // Implémenter la logique de dépublication
};
</script>

<style scoped>
.project-actions {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.action-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.action-section h4 {
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #374151;
}

.action-section button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.no-actions {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fef3c7;
  border-radius: 0.375rem;
  color: #92400e;
}

.debug-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
}

.debug-info pre {
  overflow-x: auto;
  font-size: 0.75rem;
  background-color: white;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

button {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:hover {
  background-color: #059669;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background-color: #d97706;
}
</style>
