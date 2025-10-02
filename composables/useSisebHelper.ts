export const useSisebHelper = () => {

    const { $sisepApi } = useNuxtApp()

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

    }
}


// {
//     "savedFile": {
//     "id": "f58b5bb2-a9da-4a78-886f-bf19b25cf935",
//         "storageName": "52c5a459-f83b-4adb-a68d-caf34b907077.png",
//         "storageBucket": "projects",
//         "extension": ".png",
//         "size": 55749,
//         "createdAt": "2025-10-01T21:22:14.532Z",
//         "deletedAt": null
// }
// }