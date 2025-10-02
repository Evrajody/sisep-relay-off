// vueform.config.(js|ts)

import fr from "@vueform/vueform/locales/fr";
import en from "@vueform/vueform/locales/en";
import tailwind from "@vueform/vueform/dist/tailwind";
import {defineConfig} from "@vueform/vueform";

// import MaskPlugin from "@vueform/plugin-mask";
// import FormStep_snow from "~/components/templates/FormStep_snow.vue";

const runtimeConfig = useRuntimeConfig();
// const { data, token } = useAuth();

// LOCAL CUSTOMISATIONS

fr.vueform.elements.file.dndTitle = "Téléverser le fichier";
fr.vueform.elements.file.dndDescription =
    "Déposez le fichier ou cliquez ici pour le téléverser.";
fr.vueform.steps.finish = "Soumettre";

export default defineConfig({
    size: "lg",
    locale: "fr",
    theme: tailwind,
    locales: {fr, en},
    classHelpers: true,
    uploadTempFile: false,
    uploadTempEndpoint: false,
    floatPlaceholders: false,
    scrollToInvalid: true,
    showRequired: ["label", "placeholder", "floating"],
    validateOn: "step",

    axios: {
        withCredentials: false,
        baseURL: runtimeConfig.public.sisebApiBaseUrl,
    },

    views: {},

    templates: {},

    rules: {},

    elements: [],

    endpoints: {
        uploadTempFile: {
            method: "POST",
            url: "/upload-files",
        },

        removeTempFile: {
            url: "/deleteUploadFile",
            method: "DELETE",
        },

        removeFile: {
            url: "/deleteUploadFile",
            method: "DELETE",
        },
    },

    addClasses: {
        Vueform: {
            form: "w-full",
        },
        ElementLayout: {
            outerWrapper: "w-full gap-y-1",
        },

        ElementRequired: {
            container: "px-1 text-red-600",
        },

        ElementLabel: {
            container: "w-full font-semibold",
        },

        FormElements: {
            container: "space-y-3 lg:space-y-0",
        },

        FormStepsControls: {
            container: "border-t border-gray-300/50 pt-2",
        },
    },

    replaceClasses: {
        FormElements: {
            container: {
                grid: "lg:grid w-full",
            },
        },

        FormStepsControls: {
            container_sm: {
                "form-mt-gutter": "sm:mt-3",
            },
        },
    },

    columns: {
        default: {container: 12, label: 12, wrapper: 12},
        sm: {container: 12, label: 12, wrapper: 12},
        md: {container: 12, label: 12, wrapper: 12},
        lg: {container: 6, label: 12, wrapper: 12},
    },
    plugins: [],
});
