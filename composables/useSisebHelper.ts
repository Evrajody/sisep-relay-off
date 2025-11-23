export const useSisebHelper = () => {

    const { $sisepApi, $sisepStatsApi, $sisepActiviteApi } = useNuxtApp()

    const loadAccessibleModules = async (query: string) => {
        const modulesRequestData = await $sisepApi("modules", {
            method: "GET",
            query: {
                search: query,
            },
        });
        return modulesRequestData?.data.modules;
    };

   const loadIndicators = async (query: string) => {
        const indicatorsRequest = await $sisepStatsApi("indicators", {
            method: "GET",
            query: {
                search: query,
                paginateData: false
            },
        });
        return indicatorsRequest?.indicators.map(entry => ({
            denomination: entry.artefact.nameJson.fr,
            id: entry.id,
        }));
    };

    const loadDepartements = async (query: string) => {
        const departementsData = await $sisepStatsApi("locations", {
            method: "GET",
            query: {
                search: query,
                paginateData: false,
                type: "department"
            },
        });
        return departementsData?.locations;
    };

    const loadfunctionalGroup = async (query: string) => {
        const conventionsData = await $sisepActiviteApi("functional-groups", {
            method: "GET",
        });
        return conventionsData?.data;
    };

    const loadConventions = async (query: string) => {
        const conventionsData = await $sisepActiviteApi("conventions", {
            method: "GET",
            query: {
                search: query,
                paginateData: false
            },
        });
        return conventionsData?.data;
    }

    const loadVilles = async (query: string) => {
        const villesData = await $sisepStatsApi("locations", {
            method: "GET",
            query: {
                search: query,
                paginateData: false
            },
        });
        return villesData?.locations;
    };

    const loadStructures = async (query: string) => {
        const structuresData = await $sisepApi("structures", {
            method: "GET",
            query: {
                search: query,
                paginateData: false
            },
        });
        return structuresData?.data;
    }

    /* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
    /**
     * Upload a file to the backend
     * @param {any} file - The file to be uploaded
     * @param {any} el - The element associated with the file input
     * @returns {Promise<Response>} - The response from the backend
     */
    /* <<<<<<<<<<  ff198bfb-05b5-46ff-8bf1-199e82554a3b  >>>>>>>>>>> */
    const uploadFileDocument = async function (file: any, el$: any) {
        // Build FormData properly and let the browser set the multipart boundary
        // Ensure we append with a filename if available
        // Do NOT set Content-Type manually; the browser will add the correct boundary
        const formData = new FormData();
        const filename = (file && (file.name || file.filename)) || "upload";
        formData.append("file", file as Blob, filename as string);

        const response = await $sisepApi("api/utils/auth/uploadFiles", {
            method: "POST",
            body: formData,
        });
        return response;
    };


    return {
        loadAccessibleModules,
        uploadFileDocument,
        loadIndicators,
        loadVilles,
        loadDepartements,
        loadfunctionalGroup,
        loadConventions,
        loadStructures
    }
}
