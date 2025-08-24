<template>
    <div
        class="rounded-xl border-2 border-primary bg-white text-card-foreground shadow group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div class="relative h-48 overflow-hidden rounded-t-lg"><img
                alt="Aménagement de la Zone Économique Spéciale de Glo-Djigbé"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&amp;h=400&amp;fit=crop">
            <div class="absolute top-4 right-4">
                <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow bg-white/50 text-gray-600 border-blue-200">
                    En cours</div>
            </div>
        </div>
        <div class="flex flex-col space-y-1.5 p-6 pb-2">
            <div class="flex justify-between items-start mb-2">
                <div
                    class="inline-flex items-center rounded-md border-2 border-primary-500 bg-gray-200 px-2.5 py-0.5 font-semibold transition-colors 
                                        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs">
                    Économie</div>
                <div class="flex items-center text-gray-500 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14"
                        height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin mr-1"
                        aria-hidden="true">
                        <path
                            d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0">
                        </path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>Atlantique</div>
            </div>
            <div
                class="font-semibold text-wrap tracking-tight text-lg group-hover:text-primary-600 transition-colors duration-200">
                Aménagement de la Zone Économique Spéciale de Glo-Djigbé</div>
            <div class="text-muted-foreground text-sm line-clamp-2">Développement d'une zone
                économique spéciale avec infrastructures industrielles et logistiques modernes.
            </div>
        </div>
        <div class="p-6 pt-0">
            <div class="space-y-4">
                <div class="flex flex-col items-start gap-y-2 justify-between text-sm text-gray-600">
                    <div class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar mr-1"
                            aria-hidden="true">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>01/01/2021</div>
                    <div class="flex items-center text-lg text-red-500 font-bold">45 000 000 000&nbsp;F CFA</div>
                </div>
            </div>
            <button
                class=" border-2 bg-primary text-white  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-9 px-4 py-2 w-full hover:text-white/50 hover:bg-opacity-80 mt-4">Voir
                les Détails<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-arrow-right ml-2" aria-hidden="true">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg></button>
        </div>
    </div>
</template>