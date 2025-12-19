<script>
    let isMenuOpen = $state(false);
</script>

<!-- Navigation Bar -->
<nav class="bg-white shadow sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      
        <a href="/" class="flex items-center space-x-2">
            <!-- Insert your logo image here -->
            <img src="/dealeredge-high-resolution-logo-transparent.webp" alt="DealerEdge Logo" class="h-8 w-auto">
            <!-- <span class="text-2xl font-bold">DealerEdge</span> -->
        </a>
  
      <!-- Desktop Menu -->
      <ul class="hidden md:flex space-x-6 items-center">
        <li><a href="#home" class="text-gray-700 hover:text-gray-900 transition-colors">Home</a></li>
        <li><a href="#features" class="text-gray-700 hover:text-gray-900 transition-colors">Features</a></li>
        <li><a href="#pricing" class="text-gray-700 hover:text-gray-900 transition-colors">Pricing</a></li>
        <li><a href="#about" class="text-gray-700 hover:text-gray-900 transition-colors">About Us</a></li>
        <li><a href="#testimonials" class="text-gray-700 hover:text-gray-900 transition-colors">Testimonials</a></li>
        <li><a href="#videos" class="text-gray-700 hover:text-gray-900 transition-colors">Videos</a></li>
        <li><a href="#screenshots" class="text-gray-700 hover:text-gray-900 transition-colors">Screenshots</a></li>
        <li><a href="#resources" class="text-gray-700 hover:text-gray-900 transition-colors">Resources</a></li>
        <li><a href="#contact" class="text-gray-700 hover:text-gray-900 transition-colors">Contact</a></li>
        <li>
          <button
            class="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
            onclick={() => isModalOpen = true}
          >
            Request Demo
          </button>
        </li>
      </ul>
  
      <!-- Mobile Menu Button -->
      <button
        class="md:hidden text-gray-700 focus:outline-none"
        onclick={() => isMenuOpen = !isMenuOpen}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if isMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  
    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden bg-white shadow">
        <ul class="flex flex-col items-center space-y-4 py-4">
          <li><a href="#home" class="text-gray-700 hover:text-gray-900 transition-colors">Home</a></li>
          <li><a href="#features" class="text-gray-700 hover:text-gray-900 transition-colors">Features</a></li>
          <li><a href="#pricing" class="text-gray-700 hover:text-gray-900 transition-colors">Pricing</a></li>
          <li><a href="#about" class="text-gray-700 hover:text-gray-900 transition-colors">About Us</a></li>
          <li><a href="#testimonials" class="text-gray-700 hover:text-gray-900 transition-colors">Testimonials</a></li>
          <li><a href="#videos" class="text-gray-700 hover:text-gray-900 transition-colors">Videos</a></li>
          <li><a href="#screenshots" class="text-gray-700 hover:text-gray-900 transition-colors">Screenshots</a></li>
          <li><a href="#resources" class="text-gray-700 hover:text-gray-900 transition-colors">Resources</a></li>
          <li><a href="#contact" class="text-gray-700 hover:text-gray-900 transition-colors">Contact</a></li>
          <li>
            <button
              class="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition-colors"
              onclick={() => { isModalOpen = true; isMenuOpen = false; }}
            >
              Request Demo
            </button>
          </li>
        </ul>
      </div>
    {/if}
</nav>
