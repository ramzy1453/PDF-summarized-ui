<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Navbar from '$components/Navbar/index.svelte';
</script>

<Navbar />
<div class="mx-auto flex max-w-6xl flex-col px-8 py-4">
	{@render children()}
</div>
