<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import Loader from './Loader.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.ts';
	import { dialog } from '$lib/store/index.svelte.ts';

	let { operation }: { operation?: string } = $props();
	const operations = {
		uploading: 'Uploading...',
		summarizing: 'Summarizing...',
		asking: 'Asking...'
	};
</script>

<Dialog.Root open={dialog.open} closeOnEscape={false} closeOnOutsideClick={false}>
	<!-- <Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger> -->
	<Dialog.Content class="sm:max-w-fit">
		<Loader text={operations[operation]} />
	</Dialog.Content>
</Dialog.Root>
