<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Button } from '$lib/components/ui/button/index.ts';

	let { summarizePDF } = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Summarize</Card.Title>
		<Card.Description>
			Summarize a PDF file to get a brief overview of the content.
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button onclick={summarizePDF}>Summarize</Button>
	</Card.Content>
</Card.Root>
