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
                        <a href="/dashboard" class="bg-[#1498DA] text-white px-4 py-2 rounded mb-2 flex items-center">
                            <i class="fas fa-table mr-2"></i>
                            Tableau de bord
                        </a>

                        <a href="/dashboard/projets" class="px-4 py-2 text-green-200 flex items-center">
                            <i class="fas fa-folder mr-2"></i>
                            Projets
                        </a>
                    </ul>

                    <hr class="w-full ml-5">

                    <ul class="px-4 py-2 my-14">
                        <a class="px-4 py-2 text-green-200 flex items-center">
                            <i class="fas fa-question-circle mr-2"></i>
                            Assistance
                        </a>

                        <a class="px-4 py-2 text-green-200 flex items-center">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Déconnexion
                        </a>
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

                <!-- Content Area -->
                <div class="flex-1 p-6">
                    <div class="bg-white bg-opacity-75 rounded-2xl p-6 h-full">

                        <p class="flex justify-end flex-row">
                            <span
                                class="text-end relative w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-40 border ">
                                <Icon size="24" name="heroicons:bell" class=" text-black " />
                                <span
                                    class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </span>
                        </p>

                        <div class="flex flex-row justify-between items-center mb-6">
                            <div class="">
                                <h2 class="text-3xl font-extrabold text-[#1498DA] mb-2">Ravie de te revoir</h2>
                                <p class="text-xl ">Vous êtes sur votre système de collecte, validation et publication
                                    de données statistiques sur l'environnement</p>
                            </div>
                        </div>

                        <!-- Statistics Cards -->
                        <div class="mb-8 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center py-4 px-10">
                            <h3 class="text-xl font-semibold mb-4 self-start">Vos statistiques</h3>
                            <div class="grid grid-cols-4 gap-5 self-start">
                                <!-- Card 1 -->
                                <div class="bg-opacity-20 bg-[#15A37F] w-[17vw] h-[12dvh] p-4 rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-lg text-gray-600 font-semibold">Nombre de projets</span>
                                        <i class="fas fa-leaf text-green-600"></i>
                                    </div> 
                                    <div class=" flex flex-row justify-between items-center ">
                                        <span class="text-2xl font-bold" >15.0k</span>
                                        <span class="w-auto h-auto bg-white" >
                                            <Icon size="33" name="heroicons:folder-open" class="text-[#15A37F] font-bold  " />
                                        </span>
                                    </div>
                                </div>

                                <!-- Card 2 -->
                                <div class="bg-[#FEA427] bg-opacity-20 w-[17vw] h-[12dvh] p-4 rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-lg text-gray-600 font-semibold">Projets en cours</span>
                                        <i class="fas fa-chart-bar text-orange-600"></i>
                                    </div>
                                    <div class=" flex flex-row justify-between items-center ">
                                        <span class="text-2xl font-bold" >15.0k</span>
                                        <span class="w-auto h-auto bg-white" >
                                            <Icon size="33" name="heroicons:clock" class="text-[#FEA427] font-bold  " />
                                        </span>
                                    </div>
                                </div>

                                <!-- Card 3 -->
                                <div class="bg-[#EF4748] bg-opacity-20 p-4 w-[17vw] h-[12dvh] rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-lg text-gray-600 font-semibold">Projets développés</span>
                                        <i class="fas fa-calendar text-red-600"></i>
                                    </div>
                                    <div class=" flex flex-row justify-between items-center ">
                                        <span class="text-2xl font-bold" >15.0k</span>
                                        <span class="w-auto h-auto bg-white" >
                                            <Icon size="33" name="heroicons:check-circle" class="text-[#EF4748] font-bold  " />
                                        </span>
                                    </div>
                                </div>

                                <!-- Card 4 -->
                                <div class="bg-[#1498DA] bg-opacity-20 p-4 w-[17vw] h-[12dvh] rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-lg text-gray-600 font-semibold">Commentaires</span>
                                        <i class="fas fa-comments text-blue-600"></i>
                                    </div>
                                    <div class=" flex flex-row justify-between items-center ">
                                        <span class="text-2xl font-bold" >15.0k</span>
                                        <span class="w-auto h-auto bg-white" >
                                            <Icon size="33" name="heroicons:chat-bubble-oval-left-ellipsis" class="text-[#1498DA] font-bold  " />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex gap-6">
                            <div class="flex-1 p-5 bg-[#C3DBD6] rounded-lg ">
                                <h3 class="text-lg font-semibold">Les récentes projets</h3>

                                <!-- Project Grid -->
                                <div class="grid grid-cols-2 gap-y-5 mt-2">
                                    <!-- Project 1 -->
                                    <div
                                        class="relative transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-[22vw] min-h-[25dvh] max-h-[25dvh] bg-white">
                                        <div class="bg-[#ECC916] text-xs px-2 py-1 rounded absolute top-2 right-3 z-10">
                                            22-04-2015</div>
                                        <img src="~/assets/images/bill_director.jpg" alt="Project"
                                            class="w-full h-[90%] object-cover">
                                        <div
                                            class="bg-white w-[19vw] text-xs rounded-lg px-2 py-1 absolute bottom-0 left-5 justify-between gap-y-2 flex flex-col items-start">
                                            <span
                                                class="text-white px-1 w-full text-lg bg-[#018751] rounded-br-11xl  font-bold ">Accord
                                                de Dégunany</span>
                                            <div class="flex flex-row items-center justify-between w-full">
                                                <span class="ml-2 text-lg">En savoir plus</span>
                                                <i
                                                    class="fas fa-arrow-right ml-1 rounded-full bg-[#018751] px-2 text-white py-1 shadow-lg text-center ">
                                                    <Icon name="heroicons:arrow-right" class="w-4 h-5 text-white" />
                                                </i>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="relative transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-[22vw] min-h-[25dvh] max-h-[25dvh] bg-white">
                                        <div class="bg-[#ECC916] text-xs px-2 py-1 rounded absolute top-2 right-3 z-10">
                                            22-04-2015</div>
                                        <img src="~/assets/images/bill_director.jpg" alt="Project"
                                            class="w-full h-[90%] object-cover">
                                        <div
                                            class="bg-white w-[19vw] text-xs rounded-lg px-2 py-1 absolute bottom-0 left-5 justify-between gap-y-2 flex flex-col items-start">
                                            <span
                                                class="text-white px-1 w-full text-lg bg-[#018751] rounded-br-11xl  font-bold ">Accord
                                                de Dégunany</span>
                                            <div class="flex flex-row items-center justify-between w-full">
                                                <span class="ml-2 text-lg">En savoir plus</span>
                                                <i
                                                    class="fas fa-arrow-right ml-1 rounded-full bg-[#018751] px-2 text-white py-1 shadow-lg text-center ">
                                                    <Icon name="heroicons:arrow-right" class="w-4 h-5 text-white" />
                                                </i>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="relative transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-[22vw] min-h-[25dvh] max-h-[25dvh] bg-white">
                                        <div class="bg-[#ECC916] text-xs px-2 py-1 rounded absolute top-2 right-3 z-10">
                                            22-04-2015</div>
                                        <img src="~/assets/images/bill_director.jpg" alt="Project"
                                            class="w-full h-[90%] object-cover">
                                        <div
                                            class="bg-white w-[19vw] text-xs rounded-lg px-2 py-1 absolute bottom-0 left-5 justify-between gap-y-2 flex flex-col items-start">
                                            <span
                                                class="text-white px-1 w-full text-lg bg-[#018751] rounded-br-11xl  font-bold ">Accord
                                                de Dégunany</span>
                                            <div class="flex flex-row items-center justify-between w-full">
                                                <span class="ml-2 text-lg">En savoir plus</span>
                                                <i
                                                    class="fas fa-arrow-right ml-1 rounded-full bg-[#018751] px-2 text-white py-1 shadow-lg text-center ">
                                                    <Icon name="heroicons:arrow-right" class="w-4 h-5 text-white" />
                                                </i>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="relative transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-[22vw] min-h-[25dvh] max-h-[25dvh] bg-white">
                                        <div class="bg-[#ECC916] text-xs px-2 py-1 rounded absolute top-2 right-3 z-10">
                                            22-04-2015</div>
                                        <img src="~/assets/images/bill_director.jpg" alt="Project"
                                            class="w-full h-[90%] object-cover">
                                        <div
                                            class="bg-white w-[19vw] text-xs rounded-lg px-2 py-1 absolute bottom-0 left-5 justify-between gap-y-2 flex flex-col items-start">
                                            <span
                                                class="text-white px-1 w-full text-lg bg-[#018751] rounded-br-11xl  font-bold ">Accord
                                                de Dégunany</span>
                                            <div class="flex flex-row items-center justify-between w-full">
                                                <span class="ml-2 text-lg">En savoir plus</span>
                                                <i
                                                    class="fas fa-arrow-right ml-1 rounded-full bg-[#018751] px-2 text-white py-1 shadow-lg text-center ">
                                                    <Icon name="heroicons:arrow-right" class="w-4 h-5 text-white" />
                                                </i>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Notifications Panel -->

                            <div
                                class="max-w-md p-3 mx-auto border-2 border-gray-400 rounded-2xl shadow-lg overflow-hidden">
                                <!-- Header -->
                                <div class=" p-4 ">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center space-x-3">
                                            <div
                                                class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                                <Icon name="heroicons:chat-bubble-left-right"
                                                    class="w-4 h-5 text-white" />
                                            </div>
                                            <h1 class="text-xl font-semibold text-gray-800">Alertes</h1>
                                        </div>
                                        <button
                                            class="px-4 py-2 border-2 border-[#1498DA] text-[#1498DA] text-sm rounded-lg transition-colors">
                                            Voir plus
                                        </button>
                                    </div>
                                </div>


                                <!-- Alerts list -->
                                <div
                                    class="rounded-xl p-4 bg-gradient-to-br from-green-700 to-green-900 text-white space-y-6">
                                    <div v-for="(comment, index) in alerts" :key="index">
                                        <div class="flex items-start space-x-3">
                                            <p>{{ comment.avatar }}</p>
                                            <div>
                                                <p class="text-sm">
                                                    <span class="font-bold">{{ comment.user }}</span>
                                                    <span class="ml-1">{{ comment.role }}</span>
                                                </p>
                                                <p class="text-xs font-bold mt-1">{{ comment.time }}</p>
                                                <p class="mt-2 text-sm leading-tight">{{ comment.message }}</p>
                                            </div>
                                        </div>
                                        <hr v-if="index < alerts.length - 1" class="my-3 border-gray-400/50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

const alerts = reactive([
    {
        id: 1,
        user: "Jean Eric",
        role: "Super validateur",
        time: "Il y a 3 jours",
        message: "Bon boulot. ça reste les données de...",
        avatar: "👨‍💼"
    },
    {
        id: 2,
        user: "Jean Eric",
        role: "Super validateur",
        time: "Il y a 3 jours",
        message: "Bon boulot. ça reste les données de...",
        avatar: "👨‍💼"
    },
    {
        id: 3,
        user: "Jean Eric",
        role: "Super validateur",
        time: "Il y a 3 jours",
        message: "Bon boulot. ça reste les données de...",
        avatar: "👨‍💼"
    }
]);
</script>
