<script setup lang="ts">
 const props = defineProps<{ project?: {
   id?: string
   image?: string
   status?: string
   category?: string
   location?: string
   title?: string
   description?: string
   date?: string
   budget?: string | number
 } }>()

 const img = props.project?.image ?? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop'
 const status = props.project?.status ?? 'En cours'
 const category = props.project?.category ?? 'Économie'
 const location = props.project?.location ?? 'Atlantique'
 const title = props.project?.title ?? "Aménagement de la Zone Économique Spéciale de Glo-Djigbé"
 const description = props.project?.description ?? "Développement d'une zone économique spéciale avec infrastructures industrielles et logistiques modernes."
 const date = props.project?.date ?? '01/01/2021'
 const budget = props.project?.budget ?? '45 000 000 000 F CFA'

 // Intersection Observer directive for blur + slide up appearance
 const vAppear = {
   mounted(el: HTMLElement) {
     el.classList.add(
       'opacity-0',
       'translate-y-6',
       '[filter:blur(3px)]',
       'transition-all',
       'duration-700',
       'ease-out'
     )
     const io = new IntersectionObserver((entries, observer) => {
       for (const entry of entries) {
         if (entry.isIntersecting) {
           el.classList.remove('opacity-0', 'translate-y-6', '[filter:blur(3px)]')
           el.classList.add('opacity-100', 'translate-y-0', '[filter:blur(0px)]')
           observer.unobserve(el)
         }
       }
     }, { threshold: 0.2 })
     io.observe(el)
   }
 } as any
</script>

<template>
    <div
        v-appear
        class="group relative rounded-2xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 will-change-transform border border-gray-100">
        <div class="relative h-56 overflow-hidden">
          <!-- Overlay gradient -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <img
                :alt="title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                :src="img">

            <!-- Status badge redesigné -->
            <div class="absolute top-4 right-4 z-20">
                <div class="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md bg-white/90 text-gray-800 shadow-lg border border-white/40">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    {{ status }}
                </div>
            </div>
        </div>
        <div class="p-6 space-y-4">
            <div class="flex justify-between items-start gap-3">
                <div class="inline-flex items-center rounded-full px-3 py-1 bg-gradient-to-r from-sisep-hit/10 to-red-600/10 text-sisep-hit text-xs font-semibold border border-sisep-hit/20">
                    {{ category }}
                </div>
                <div class="flex items-center text-gray-500 text-xs gap-1">
                    <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5" />
                    {{ location }}
                </div>
            </div>

            <div>
                <h3 class="font-bold text-lg text-gray-900 group-hover:text-sisep-hit transition-colors duration-300 line-clamp-2 mb-2">
                    {{ title }}
                </h3>
                <p class="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {{ description }}
                </p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                <div class="flex flex-col gap-1">
                    <div class="flex items-center text-gray-500 text-xs gap-1">
                        <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
                        <span>{{ date }}</span>
                    </div>
                    <div class="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-sisep-hit to-red-600">
                        {{ budget }}
                    </div>
                </div>

                <NuxtLink
                    :to="props.project?.id ? `/project/single/${props.project.id}` : '#'"
                    class="group/btn relative inline-flex items-center gap-2 bg-gradient-to-r from-sisep-hit to-red-600 hover:from-red-600 hover:to-sisep-hit text-white rounded-lg px-4 py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden">
                    <span class="relative z-10">Détails</span>
                    <UIcon name="i-heroicons-arrow-right" class="relative z-10 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    <span class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>