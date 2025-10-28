
import type {Project, UserType} from "~/types";

// === -------------------------------------------------------------- === //
// TODO: PERMISSIONS DU PROJET

// => LISTER LES PROJETS PERSONNELS
export const canListOwnProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LIST_OWN_PROJECT || false;
});

// => METTRE A JOUR TOUS LES INDICATEURS
export const canUpdateAllIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UPDATE_ALL_INDICATOR || false;
});

// => PUBLIER UN PROJET
export const canPublishProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_PUBLISH_PROJECT || false;
});

// => LISTER LES INDICATEURS PERSONNELS
export const canListOwnIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LIST_OWN_INDICATOR || false;
});

// => SUPER VALIDATEUR
export const canSuperValidateur = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_SUPER_VALIDATEUR || false;
});

// => DEMANDER UNE MISE A JOUR
export const canAskForUpdate = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_ASK_FOR_UPDATE || false;
});

// => METTRE A JOUR UN PROJET
export const canUpdateProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UPDATE_PROJECT || false;
});

// => LISTER TOUS LES PROJETS
export const canListAllProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LIST_ALL_PROJECT || false;
});

// => ASSIGNER UN PROJET
export const canAssignProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_ASSIGN_PROJECT;
});

// => CREER UN PROJET
export const canCreateProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_CREATE_PROJECT || false;
});

// => ADMINISTRATEUR
export const canAdmin = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_ADMIN || false;
});

// => METTRE A JOUR TOUS LES PROJETS
export const canUpdateAllProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UPDATE_ALL_PROJECT || false;
});

// => POINT FOCAL
export const canPointFocal = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_POINT_FOCAL || false;
});

// => METTRE A JOUR SES PROPRES PROJETS
export const canUpdateOwnProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UPDATE_OWN_PROJECT || false;
});

// => MODIFIER UN PROJET
export const canModifyProject = defineAbility((user: UserType, args : Project) => {
    // TODO: CETTE REGLE DEVRAIT ETRE SYNCHRONISE AVEC LE BACKEND
    // console.log("HERRREEESSSSS", (user?.additional_info?.persmissions?.CAN_MODIFY_PROJECT === true && user?.additional_info.persmissions?.CAN_ADMIN === true && args.structure === null))
    // return (user?.additional_info?.persmissions?.CAN_MODIFY_PROJECT && user?.additional_info.persmissions?.CAN_ADMIN  && args.structure == null) || (user?.additional_info.persmissions?.CAN_MODIFY_PROJECT  && user?.additional_info.persmissions?.CAN_POINT_FOCAL);
    return (user?.additional_info.persmissions?.CAN_ADMIN && args.structure == null) || (user?.additional_info?.persmissions.CAN_UPDATE_PROJECT)
});


// => VALIDATEUR
export const canValidateur = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_VALIDATEUR || false;
});

// => SOUMETTRE UN PROJET POUR VALIDATION
export const canSubmitProjectForValidation = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions.CAN_SUBMIT_PROJECT_FOR_VALIDATION;
});

// => REJETER UN PROJET
export const canRejectProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_REJECT_PROJECT || false;
});

// => METTRE A JOUR SES PROPRES INDICATEURS
export const canUpdateOwnIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UPDATE_OWN_INDICATOR || false;
});

// => VALIDER UN PROJET
export const canValidateProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_VALIDATE_PROJECT || false;
});

// => DEPUBLIER UN PROJET
export const canUnpublishProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_UNPUBLISH_PROJECT || false;
});

// => CREER UN INDICATEUR
export const canCreateIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_CREATE_INDICATOR || false;
});

// => LISTER TOUS LES INDICATEURS
export const canListAllIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LIST_ALL_INDICATOR || false;
});

// => SUPPRIMER UN PROJET
export const canDeleteProject = defineAbility((user: UserType, args) => {
    // TODO: CETTE REGLE DEVRAIT ETRE SYNCHRONISE AVEC LE BACKEND
    // return (user?.additional_info.persmissions?.CAN_ADMIN && args.structure == null && user?.additional_info.persmissions?.CAN_DELETE_PROJECT);
    return (user?.additional_info.persmissions?.CAN_ADMIN && user?.additional_info.persmissions?.CAN_DELETE_PROJECT);
});

// => SUPPRIMER UN INDICATEUR
export const canDeleteIndicator = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_DELETE_INDICATOR || false;
});

// => SOUMETTRE POUR VALIDATION UN PROJET
export const canSubmitValidationProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_SUBMIT_VALIDATION_PROJECT || false;
});

// => DEMANDER UNE MISE A JOUR DU PROJET
export const canAskUpdateProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_ASK_UPDATE_PROJECT || false;
});

// => LISTER LES PROJETS
export const canListProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LIST_PROJECT || false;
});

// => LIER UN INDICATEUR A UN PROJET
export const canLinkIndicatorToProject = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_LINK_INDICATOR_TO_PROJECT || false;
});

// => DGEC
export const canDgec = defineAbility((user: UserType, args) => {
    return user?.additional_info.persmissions?.CAN_DGEC || false;
});

