<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.ts';
	import Loader from './Loader.svelte';
	import { dialog } from '$lib/store/index.svelte.ts';
</script>

<Dialog.Root open={dialog.open} closeOnEscape={false} closeOnOutsideClick={false}>
	<Dialog.Content class="sm:max-w-fit">
		<Loader />
	</Dialog.Content>
</Dialog.Root>
