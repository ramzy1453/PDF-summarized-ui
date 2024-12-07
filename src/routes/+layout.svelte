<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="border border-emerald-800">
	{@render children()}
</div>
