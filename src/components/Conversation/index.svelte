<script lang="ts">
	import type { IConversation } from '$types/index.js';
	import SvelteMarkdown from 'svelte-markdown';

	let {
		output,
		conversations
	}: {
		output: string;
		conversations: IConversation[];
	} = $props();

	let containerRef: HTMLDivElement;
	$effect(() => {
		if (conversations.length > 0) {
			containerRef.scrollTo({
				top: containerRef.scrollHeight,
				behavior: 'smooth'
			});
		}
	});
</script>

<div bind:this={containerRef} class="flex flex-1 flex-col space-y-2 overflow-y-scroll p-4">
	{#if conversations.length === 0}
		<div class="text-gray-500">No conversations yet.</div>
	{/if}

	{#each conversations as conversation, i (i)}
		<div class="self-end rounded-xl border bg-black px-4 py-2 text-white shadow">
			{conversation.request}
		</div>
		<div class="max-w-2xl rounded-xl border bg-gray-50 px-4 py-2 shadow">
			<SvelteMarkdown source={conversation.response} />
		</div>
	{/each}
</div>
