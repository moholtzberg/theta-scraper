<script>
    let { videos } = $props();
</script>
  
<section id="videos" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">🎥 Videos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each videos as video}
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="relative pb-9/16">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            <div class="p-4">
              <h3 class="text-xl font-semibold text-gray-800">{video.title}</h3>
            </div>
          </div>
        {/each}
      </div>
    </div>
</section>
