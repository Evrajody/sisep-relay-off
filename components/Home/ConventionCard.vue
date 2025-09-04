
<script lang="ts" setup>

const props = defineProps({
    convention: {
        type: Object,
        required: true
    }
})

// Simple Intersection Observer directive to animate on enter (blur + slide up)
const vAppear = {
  mounted(el: HTMLElement) {
    // initial state
    el.classList.add(
      'opacity-0',
      'translate-y-6',
      '[filter:blur(3px)]',
      'transition-all',
      'duration-700',
      'ease-out'
    )

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // animate in
            el.classList.remove('opacity-0', 'translate-y-6', '[filter:blur(3px)]')
            el.classList.add('opacity-100', 'translate-y-0', '[filter:blur(0px)]')
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
  }
} as any

</script>

<template>
    <div
        v-appear
        class="bg-white text-card-foreground shadow group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden will-change-transform">
        <div class="relative flex flex-col md:flex-row">
            <!-- Left: Image -->
            <div class="relative md:w-56 lg:w-64 h-40 md:h-auto shrink-0 overflow-hidden">
                <img :alt="props.convention.title"
                     :src="props.convention.image"
                     class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                <!-- Hover gradient overlay -->
                <div class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-transparent to-primary/20"></div>
                <!-- Status badge -->
                <div class="absolute top-3 right-3">
                    <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors shadow bg-white/60 backdrop-blur border-green-200 text-gray-700">
                        Signée
                    </div>
                </div>
            </div>

            <!-- Right: Content -->
            <div class="flex-1 p-5 md:p-6 flex flex-col gap-3">
                <!-- Top row: category and scope -->
                <div class="flex items-start justify-between">
                    <div class="inline-flex items-center rounded-md border-2 border-primary-500 bg-gray-200 px-2.5 py-0.5 font-semibold text-xs">
                        {{ props.convention.category }}
                    </div>
                    <div class="flex items-center text-gray-500 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe mr-1" aria-hidden="true">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Internationale
                    </div>
                </div>

                <!-- Main title at top -->
                <h3 class="font-semibold text-lg md:text-xl tracking-tight group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                    {{ props.convention.title }}
                </h3>

                <!-- Description below -->
                <p class="text-muted-foreground text-sm line-clamp-2">
                    {{ props.convention.description }}
                </p>

                <!-- Bottom meta + CTA -->
                <div class="mt-1 md:mt-auto">
                    <div class="flex items-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar mr-1" aria-hidden="true">
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                        12/12/2015
                    </div>
                    <button class="mt-3 w-fit bg-primary-500 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2.5 hover:text-white/80 hover:bg-primary-600">
                        Lire la Convention
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right ml-2" aria-hidden="true">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
