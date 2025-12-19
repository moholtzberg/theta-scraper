<script>
    let { screenshots } = $props();
</script>
  
<section id="screenshots" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">📸 Screenshots</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each screenshots as screenshot}
          <div class="relative group overflow-hidden rounded-lg shadow-md">
            <img src={screenshot.src} alt={screenshot.alt} class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
              <span class="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">{screenshot.description}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
</section>
