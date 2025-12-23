<script>
  import Modal from '$lib/components/Modal.svelte';

  let isModalOpen = $state(false);
</script>

<!-- Home Section -->
<section id="home" class="bg-slate-800 text-white py-24">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-5xl font-bold mb-6">🚀 Revolutionize Your Office Equipment Dealership</h1>
    <p class="text-xl mb-8 max-w-2xl mx-auto">DealerEdge – The Modern, Web-Based Management System Designed for Today's Dealers</p>
    <button
      class="bg-white text-slate-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition-colors"
      onclick={() => isModalOpen = true}
    >
      Get Started
    </button>
  </div>
</section>


<!-- Modal Component -->
<Modal isOpen={isModalOpen} on:close={() => isModalOpen = false} />