<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Navbar from '$components/Navbar/index.svelte';
</script>

<Navbar />
<div class="mx-auto max-w-6xl px-8 py-4">
	{@render children()}
</div>
