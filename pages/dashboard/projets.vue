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
                    <div class="bg-white bg-opacity-75 rounded-2xl p-6 h-full">

                        <div class="flex flex-row gap-x-5 justify-end ">
                            <div class="flex flex-row items-center border-2 gap-x-2 border-black border-opacity-30 ">
                                <Icon size="24" name="heroicons:magnifying-glass"
                                    class=" text-black text-opacity-70 px-3 " />
                                <input type="text" placeholder="Trouvez les activités …"
                                    class=" bg-transparent w-[20vw] px-4 py-1 border-2 border-none rounded-l outline-none focus:outline-none" />
                            </div>
                            <span
                                class="text-end relative w-10 h-10 flex items-center justify-center rounded-full bg-white bg-opacity-40 border ">
                                <Icon size="24" name="heroicons:bell" class=" text-black " />
                                <span
                                    class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                            </span>
                        </div>

                        <div class="p-14 flex flex-row items-center justify-between">
                            <h2 class="text-3xl font-extrabold mb-2">La liste de vos projets </h2>
                            <a href="/dashboard/projets-create"
                                class="bg-[#1498DA] text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 mt-auto">
                                Ajouter un projet
                            </a>
                        </div>

                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 place-content-center mx-12 my-5">
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
                </div>
            </div>
        </div>
    </div>
</template>