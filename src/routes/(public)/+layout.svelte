<script>
	import '../app.css';
	let { children } = $props();
  import Navigation from '$lib/components/Navigation.svelte';
</script>

<Navigation />


<div class="bg-slate-800">
    {@render children()}
</div>
