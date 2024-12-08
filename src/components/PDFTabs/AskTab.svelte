<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';

	let {
		askPDF,
		question = $bindable()
	}: {
		askPDF: () => void;
		question: string;
	} = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Ask question</Card.Title>
		<Card.Description>Ask a question about the content of the PDF file.</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-2">
		<div class="space-y-1">
			<Label for="question">Your question</Label>
			<Input id="question" type="text" bind:value={question} />
		</div>
	</Card.Content>
	<Card.Footer>
		<Button onclick={askPDF}>Ask</Button>
	</Card.Footer>
</Card.Root>
