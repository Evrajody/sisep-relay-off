export const useFileDisplay = () => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.sisebApiBaseUrl;

    /**
     * Génère l'URL complète pour afficher un fichier via l'endpoint /files/display/{id}
     * Cette URL peut être utilisée directement dans les balises img, iframe, etc.
     * car le serveur gère le streaming
     * @param fileId - L'ID du fichier à afficher
     * @returns L'URL complète du fichier
     */
    const getFileDisplayUrl = (fileId: string | number): string => {
        if (!fileId) {
            console.warn('useFileDisplay: fileId est requis');
            return '';
        }
        return `${baseUrl}files/display/${fileId}`;
    };

    /**
     * Charge un fichier en streaming et retourne un blob URL
     * Utile pour les cas où vous avez besoin d'un blob URL au lieu d'une URL directe
     * @param fileId - L'ID du fichier à charger
     * @returns Promise avec l'URL du blob
     */
    const loadFileAsBlob = async (fileId: string | number): Promise<string> => {
        if (!fileId) {
            throw new Error('fileId est requis');
        }

        try {
            const url = getFileDisplayUrl(fileId);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur lors du chargement du fichier: ${response.statusText}`);
            }

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Erreur lors du chargement du fichier:', error);
            throw error;
        }
    };

    /**
     * Génère l'URL pour afficher un fichier stocké avec bucket et storage name
     * @param storageBucket - Le bucket de stockage
     * @param storageName - Le nom du fichier en stockage
     * @returns L'URL complète du fichier
     */
    const getFileStorageUrl = (storageBucket: string, storageName: string): string => {
        if (!storageBucket || !storageName) {
            console.warn('useFileDisplay: storageBucket et storageName sont requis');
            return '';
        }
        return `${baseUrl}files/${storageBucket}/${storageName}`;
    };

    /**
     * Détermine le type de fichier basé sur son extension ou MIME type
     * @param filename - Le nom du fichier ou son MIME type
     * @returns Le type de fichier (image, pdf, video, document, etc.)
     */
    const getFileType = (filename: string): string => {
        if (!filename) return 'unknown';

        const extension = filename.toLowerCase().split('.').pop() || '';
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        const pdfExtensions = ['pdf'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac'];
        const documentExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];

        if (imageExtensions.includes(extension)) return 'image';
        if (pdfExtensions.includes(extension)) return 'pdf';
        if (videoExtensions.includes(extension)) return 'video';
        if (audioExtensions.includes(extension)) return 'audio';
        if (documentExtensions.includes(extension)) return 'document';

        return 'unknown';
    };

    /**
     * Retourne l'icône appropriée pour un type de fichier
     * @param filename - Le nom du fichier
     * @returns Le nom de l'icône Heroicons
     */
    const getFileIcon = (filename: string): string => {
        const type = getFileType(filename);

        const iconMap: Record<string, string> = {
            image: 'i-heroicons-photo',
            pdf: 'i-heroicons-document-text',
            video: 'i-heroicons-film',
            audio: 'i-heroicons-musical-note',
            document: 'i-heroicons-document',
            unknown: 'i-heroicons-document',
        };

        return iconMap[type] || 'i-heroicons-document';
    };

    /**
     * Télécharge un fichier
     * @param fileId - L'ID du fichier à télécharger
     * @param filename - Le nom du fichier (optionnel)
     */
    const downloadFile = async (fileId: string | number, filename?: string) => {
        try {
            const url = getFileDisplayUrl(fileId);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement du fichier');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || `file-${fileId}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            throw error;
        }
    };

    /**
     * Ouvre un fichier dans un nouvel onglet
     * @param fileId - L'ID du fichier à ouvrir
     */
    const openFileInNewTab = (fileId: string | number) => {
        const url = getFileDisplayUrl(fileId);
        window.open(url, '_blank');
    };

    /**
     * Nettoie un blob URL créé avec loadFileAsBlob
     * @param blobUrl - L'URL du blob à nettoyer
     */
    const revokeBlobUrl = (blobUrl: string) => {
        if (blobUrl && blobUrl.startsWith('blob:')) {
            URL.revokeObjectURL(blobUrl);
        }
    };

    return {
        getFileDisplayUrl,
        getFileStorageUrl,
        getFileType,
        getFileIcon,
        downloadFile,
        openFileInNewTab,
        loadFileAsBlob,
        revokeBlobUrl,
    };
};
