/**
 * EXEMPLES D'UTILISATION DU SYSTÈME DE PERMISSIONS
 * Ce fichier montre comment utiliser les composables de permissions dans votre code
 */

// ============================================================================
// EXEMPLE 1: Vérifier les permissions CRUD simples
// ============================================================================
/*
import { useProjectCRUDPermissions } from '~/composables/project/useProjectCRUDPermissions';

export const exampleCRUDPermissions = () => {
  const {
    canCreateProject,
    canModifyProject,
    canDeleteProject,
    canListProjects,
  } = useProjectCRUDPermissions();

  // Afficher/masquer le bouton "Créer un projet"
  if (canCreateProject()) {
    // Afficher le bouton
  }

  // Vérifier si l'utilisateur peut modifier le projet
  if (canModifyProject(project)) {
    // Afficher le bouton modifier
  }

  // Vérifier si l'utilisateur peut supprimer le projet
  if (canDeleteProject(project)) {
    // Afficher le bouton supprimer
  }

  // Vérifier si l'utilisateur peut lister les projets
  if (canListProjects()) {
    // Charger et afficher la liste des projets
  }
};
*/

// ============================================================================
// EXEMPLE 2: Utiliser les permissions pour les actions de statut
// ============================================================================
/*
import { useProjectActionAvailability } from '~/composables/project/useProjectActionAvailability';

export const exampleStatusActions = () => {
  const { isActionAvailable, getAvailableActions, getActionUnavailableReasons } =
    useProjectActionAvailability();

  const projectStatus = 'DRAFT';

  // Vérifier si une action spécifique est disponible (statut + permission)
  if (isActionAvailable(projectStatus, 'SUBMIT')) {
    // Le bouton "Soumettre" est disponible
  }

  // Obtenir toutes les actions disponibles pour ce statut
  const availableActions = getAvailableActions(projectStatus);
  console.log('Actions disponibles:', availableActions);

  // Obtenir les raisons pour lesquelles une action n'est pas disponible
  const reasons = getActionUnavailableReasons(projectStatus, 'PUBLISH');
  if (reasons.transition) {
    console.log('Action non disponible à cause de la transition de statut');
  }
  if (reasons.permission) {
    console.log('Action non disponible à cause des permissions');
  }
};
*/

// ============================================================================
// EXEMPLE 3: Utiliser les permissions directes
// ============================================================================
/*
import { usePermissions, ProjectPermission } from '~/composables/usePermissions';

export const exampleDirectPermissions = () => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreateProject,
    canValidateProject,
    isAdmin,
    getUserInfo,
  } = usePermissions();

  // Vérifier une permission spécifique
  if (hasPermission(ProjectPermission.CREATE)) {
    console.log('Peut créer un projet');
  }

  // Vérifier si l'utilisateur a AU MOINS UNE des permissions
  if (hasAnyPermission([ProjectPermission.UPDATE, ProjectPermission.MODIFY])) {
    console.log('Peut modifier un projet');
  }

  // Vérifier si l'utilisateur a TOUTES les permissions
  if (hasAllPermissions([ProjectPermission.CREATE, ProjectPermission.DELETE])) {
    console.log('Est un super utilisateur');
  }

  // Utiliser les raccourcis pratiques
  if (canCreateProject()) {
    console.log('Peut créer un projet');
  }

  if (canValidateProject()) {
    console.log('Peut valider un projet');
  }

  if (isAdmin()) {
    console.log('Est admin');
  }

  // Obtenir les infos utilisateur
  const userInfo = getUserInfo();
  console.log('Username:', userInfo.username);
  console.log('Email:', userInfo.email);
  console.log('Structures:', userInfo.structures);
  console.log('Modules:', userInfo.modules);
};
*/

// ============================================================================
// EXEMPLE 4: Intégration dans une vue Vue.js (Composant)
// ============================================================================
/*
<template>
  <div class="projects-container">
    <!-- Afficher le bouton "Créer" seulement si l'utilisateur peut créer -->
    <UButton
      v-if="canCreateProject()"
      @click="navigateTo('/projects/new')"
    >
      Créer un projet
    </UButton>

    <!-- Liste des projets avec actions CRUD -->
    <div class="projects-list">
      <div v-for="project in projects" :key="project.id" class="project-item">
        <h3>{{ project.title }}</h3>

        <!-- Boutons d'action basés sur le statut ET les permissions -->
        <div class="actions">
          <!-- Modifier -->
          <UButton
            v-if="isActionAvailable(project.status, 'MODIFY')"
            @click="editProject(project)"
          >
            Modifier
          </UButton>

          <!-- Soumettre -->
          <UButton
            v-if="isActionAvailable(project.status, 'SUBMIT')"
            @click="submitProject(project)"
          >
            Soumettre
          </UButton>

          <!-- Valider -->
          <UButton
            v-if="isActionAvailable(project.status, 'VALIDATE')"
            @click="validateProject(project)"
          >
            Valider
          </UButton>

          <!-- Publier -->
          <UButton
            v-if="isActionAvailable(project.status, 'PUBLISH')"
            @click="publishProject(project)"
          >
            Publier
          </UButton>

          <!-- Supprimer -->
          <UButton
            v-if="canDeleteProject(project)"
            color="red"
            @click="deleteProject(project)"
          >
            Supprimer
          </UButton>
        </div>
      </div>
    </div>

    <!-- Message si l'utilisateur n'a aucune permission -->
    <div v-if="!hasAnyProjectPermission()" class="no-access">
      <p>{{ getAccessDeniedMessage('read') }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProjectActionAvailability } from '~/composables/project/useProjectActionAvailability';
import { useProjectCRUDPermissions } from '~/composables/project/useProjectCRUDPermissions';

const {
  isActionAvailable,
  getActionUnavailableReasons,
} = useProjectActionAvailability();

const {
  canCreateProject,
  canModifyProject,
  canDeleteProject,
  hasAnyProjectPermission,
  getAccessDeniedMessage,
} = useProjectCRUDPermissions();
</script>
*/

// ============================================================================
// EXEMPLE 5: Vérifier les permissions avant une action critique
// ============================================================================
/*
export const exampleCheckPermissionsBeforeAction = async () => {
  const { canDeleteProject, getAccessDeniedMessage } = useProjectCRUDPermissions();
  const { isActionAvailable } = useProjectActionAvailability();

  const projectToDelete = /* ... project data ... */;

  // Vérifier avant suppression
  if (!canDeleteProject(projectToDelete)) {
    makeAlert({
      type: 'error',
      title: 'Erreur',
      message: getAccessDeniedMessage('delete'),
    });
    return;
  }

  // Si toutes les vérifications passent, procéder à la suppression
  try {
    await deleteProjectAPI(projectToDelete.id);
    makeAlert({
      type: 'success',
      title: 'Succès',
      message: 'Projet supprimé avec succès',
    });
  } catch (error) {
    makeAlert({
      type: 'error',
      title: 'Erreur',
      message: 'Une erreur est survenue lors de la suppression',
    });
  }
};
*/

// ============================================================================
// EXEMPLE 6: Afficher des informations sur les permissions manquantes
// ============================================================================
/*
export const exampleShowMissingPermissions = () => {
  const { isActionAvailable, getActionUnavailableReasons } = useProjectActionAvailability();

  const projectStatus = 'DRAFT';
  const action = 'PUBLISH';

  if (!isActionAvailable(projectStatus, action)) {
    const reasons = getActionUnavailableReasons(projectStatus, action);

    if (reasons.transition) {
      console.log(
        `Le projet ne peut pas être publié depuis le statut ${projectStatus}`
      );
    }

    if (reasons.permission) {
      console.log('Vous n\'avez pas la permission de publier ce projet');
    }
  }
};
*/

// ============================================================================
// EXEMPLE 7: Déterminer les actions possibles dynamiquement
// ============================================================================
/*
export const exampleGetAvailableActionsForUI = (projectStatus: string) => {
  const { getAvailableActions } = useProjectActionAvailability();
  const { canDeleteProject, canModifyProject } = useProjectCRUDPermissions();

  // Obtenir les actions de statut disponibles
  const statusActions = getAvailableActions(projectStatus);

  // Combiner avec les actions CRUD
  const allAvailableActions = {
    statusActions, // ['SUBMIT', 'VALIDATE', ...]
    canModify: canModifyProject(),
    canDelete: canDeleteProject(),
  };

  return allAvailableActions;
};
*/

// ============================================================================
// STRUCTURE DE LA SESSION DE L'UTILISATEUR (pour référence)
// ============================================================================
/*
{
  "user": {
    "name": "Admin Admin",
    "email": "admin@emes.bj",
    "emailVerified": false,
    "createdAt": "2025-10-21T04:00:10.427Z",
    "updatedAt": "2025-10-21T08:19:17.879Z",
    "id": "lJjz2CJmtyz0vnHcMgPUz4teUtM2hFbV"
  },
  "session": {
    "expiresAt": "2025-10-23T08:23:10.903Z",
    "token": "qSQH0JBA1d8kwOH5tO0vP2EMd4NQTIKj",
    "userId": "lJjz2CJmtyz0vnHcMgPUz4teUtM2hFbV",
    "additional_info": {
      "user": {
        "username": "admin",
        "email": "admin@emes.bj",
        "fullName": "Admin Admin"
      },
      "persmissions": {
        "CAN_CREATE_PROJECT": false,
        "CAN_UPDATE_PROJECT": false,
        "CAN_DELETE_PROJECT": false,
        "CAN_PUBLISH_PROJECT": false,
        // ... autres permissions
      },
      "structures": [],
      "modules": ["ACTIVITE"]
    }
  }
}
*/

export const PERMISSION_SYSTEM_READY = true;
