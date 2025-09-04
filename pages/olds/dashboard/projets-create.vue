<template>
    <div class="bg-gradient-to-t from-[#083D30] to-[#0D6535] relative">
        <div class="flex min-h-screen ">
            <!-- Sidebar -->
            <div class="w-64 text-white flex flex-col">
                <!-- Header -->
                <div class="w-full p-4">
                    <h1 class="text-lg font-bold text-center ">SISEB-BENIN</h1>
                </div>
                <hr class="w-full ml-5">

                <!-- Navigation -->
                <nav class="flex-1 ">
                    <ul class="px-4 py-2 my-14">
                        <li class=" text-white px-4 py-2 rounded mb-2 flex items-center">
                            <i class="fas fa-table mr-2"></i>
                            Tableau de bord
                        </li>

                        <li class="px-4 bg-[#1498DA] py-2 text-white flex items-center">
                            <i class="fas fa-folder mr-2"></i>
                            Projets
                        </li>
                    </ul>

                    <hr class="w-full ml-5">

                    <ul class="px-4 py-2 my-14">
                        <li class="px-4 py-2 text-green-200 flex items-center">
                            <i class="fas fa-question-circle mr-2"></i>
                            Assistance
                        </li>

                        <li class="px-4 py-2 text-green-200 flex items-center">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Déconnexion
                        </li>
                    </ul>
                </nav>

                <!-- User Profile -->
                <div class="p-4 border-t border-green-600">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">A</span>
                        </div>
                        <div class="ml-3">
                            <div class="text-sm font-medium">Anna Thanga</div>
                            <div class="text-xs text-green-200">annanna@gmail.com</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="flex-1 flex flex-col">
                <div class="flex-1 p-6">
                    <div class="bg-white bg-opacity-75 rounded-2xl p-6 h-full flex">
                        <div class="bg-white rounded-3xl shadow-lg p-8 w-[80vw] mx-24 max-w-4xl">
                            <h1 class="text-2xl font-bold text-gray-800 mb-8">Ajouter un projet</h1>

                            <form @submit.prevent="submitProject" class="space-y-6">
                                <!-- Première ligne : Titre et Budget -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Titre
                                        </label>
                                        <input v-model="form.titre" type="text"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="Titre du projet" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Budget
                                        </label>
                                        <input v-model="form.budget" type="text"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="Budget estimé" />
                                    </div>
                                </div>

                                <!-- Deuxième ligne : Localisation et Date -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Localisation géographique
                                        </label>
                                        <input v-model="form.localisation" type="text"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                            placeholder="Lieu du projet" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Date d'adoption
                                        </label>
                                        <input v-model="form.dateAdoption" type="date"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" />
                                    </div>
                                </div>

                                <!-- Troisième ligne : Obligations -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Obligation globale
                                        </label>
                                        <textarea v-model="form.obligationGlobale" rows="4"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                                            placeholder="Décrivez l'obligation globale"></textarea>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Obligation spécifique
                                        </label>
                                        <textarea v-model="form.obligationSpecifique" rows="4"
                                            class="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none"
                                            placeholder="Décrivez l'obligation spécifique"></textarea>
                                    </div>
                                </div>

                                <!-- Section upload de fichiers -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Ajouter( image, vidéo, document..)
                                    </label>

                                    <!-- Zone de drop -->
                                    <div @drop="handleDrop" @dragover.prevent @dragenter.prevent
                                        class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                        <!-- <p class="text-gray-500 mb-4">Ajouter un texte</p> -->

                                        <!-- Icônes de types de fichiers -->
                                        <div class="flex justify-center space-x-4 mb-4">
                                            <button type="button" @click="openFileDialog('image')"
                                                class="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </button>

                                            <button type="button" @click="openFileDialog('video')"
                                                class="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>

                                            <button type="button" @click="openFileDialog('document')"
                                                class="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </button>

                                            <button type="button" @click="openFileDialog('cloud')"
                                                class="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Liste des fichiers uploadés -->
                                        <div v-if="uploadedFiles.length > 0" class="mt-4">
                                            <div v-for="file in uploadedFiles" :key="file.name"
                                                class="flex items-center justify-between bg-white p-2 rounded mb-2">
                                                <span class="text-sm text-gray-700">{{ file.name }}</span>
                                                <button @click="removeFile(file)"
                                                    class="text-red-500 hover:text-red-700">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Input file caché -->
                                    <input ref="fileInput" type="file" multiple @change="handleFileSelect"
                                        class="hidden" />
                                </div>

                                <!-- Bouton Ajouter -->
                                <div class="flex justify-end pt-6">
                                    <button type="submit"
                                        class="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none transition-all">
                                        Ajouter
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Données du formulaire
const form = ref({
    titre: '',
    budget: '',
    localisation: '',
    dateAdoption: '',
    obligationGlobale: '',
    obligationSpecifique: ''
})

// Gestion des fichiers
const uploadedFiles = ref([])
const fileInput = ref(null)

// Méthodes
const openFileDialog = (type) => {
    console.log(`Ouverture du dialogue pour ${type}`)
    fileInput.value?.click()
}

const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    uploadedFiles.value.push(...files)
}

const handleDrop = (event) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    uploadedFiles.value.push(...files)
}

const removeFile = (fileToRemove) => {
    uploadedFiles.value = uploadedFiles.value.filter(file => file !== fileToRemove)
}

const submitProject = () => {
    console.log('Données du projet:', form.value)
    console.log('Fichiers uploadés:', uploadedFiles.value)

    // Ici vous pouvez ajouter la logique pour envoyer les données
    alert('Projet ajouté avec succès!')

    // Reset du formulaire
    form.value = {
        titre: '',
        budget: '',
        localisation: '',
        dateAdoption: '',
        obligationGlobale: '',
        obligationSpecifique: ''
    }
    uploadedFiles.value = []
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>