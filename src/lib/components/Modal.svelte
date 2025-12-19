<script>
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let title = "Request a Demo";

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  // Close modal when Escape key is pressed
  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }


</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
      <!-- Close Button -->
      <button
        class="absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none"
        on:click={closeModal}
        aria-label="Close modal"
      >
        ✖️
      </button>

      <!-- Modal Title -->
      <h2 class="text-2xl font-bold mb-4">{title}</h2>

      <!-- Modal Content (Form) -->
      <form on:submit|preventDefault>
        <div class="mb-4">
          <label for="modal-name" class="block text-slate-800 mb-2">Name*</label>
          <input
            type="text"
            id="modal-name"
            placeholder="Your Name"
            class="w-full p-3 rounded bg-gray-100 focus:outline-none"
            required
          />
        </div>
        <div class="mb-4">
          <label for="modal-email" class="block text-slate-800 mb-2">Email*</label>
          <input
            type="email"
            id="modal-email"
            placeholder="you@example.com"
            class="w-full p-3 rounded bg-gray-100 focus:outline-none"
            required
          />
        </div>
        <div class="mb-4">
          <label for="modal-phone" class="block text-slate-800 mb-2">Phone</label>
          <input
            type="tel"
            id="modal-phone"
            placeholder="(123) 456-7890"
            class="w-full p-3 rounded bg-gray-100 focus:outline-none"
          />
        </div>
        <div class="mb-4">
          <label for="modal-message" class="block text-slate-800 mb-2">Message</label>
          <textarea
            id="modal-message"
            rows="3"
            placeholder="Tell us about your needs..."
            class="w-full p-3 rounded bg-gray-100 focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-slate-800 text-white px-6 py-3 rounded hover:bg-slate-700 transition"
          on:click={closeModal}
        >
          Submit Request
        </button>
      </form>
    </div>
  </div>
{/if}
