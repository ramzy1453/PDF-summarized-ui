<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';

	import LoaderDialog from '$components/LoaderDialog/index.svelte';

	import { dialog } from '$lib/store/index.svelte';

	let files: FileList | null | undefined = $state();
	let output = $state('The summary will be displayed here.');
	let question = $state('');
	let pdf_id = $state('');

	let operation: string | undefined = $state();

	function uploadPDF() {
		const formData = new FormData();
		formData.append('pdf', files?.[0] as Blob);

		operation = 'uploading';

		fetch('http://localhost:8080/api/v1/pdf/upload', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				pdf_id = data.pdf_id;
				output = 'PDF uploaded successfully';
				console.log(data);
				dialog.open = false;
			})
			.catch((error) => {
				console.error(error);
			});
	}

	$effect(() => {
		console.log('files', files);
		if (files && files.length > 0) {
			output = 'Uploading...';
			uploadPDF();
		}
	});

	function summarizePDF() {
		operation = 'summarizing';
		dialog.open = true;
		console.log(`http://localhost:8080/api/v1/pdf/summarize/${pdf_id}`);
		fetch(`http://localhost:8080/api/v1/pdf/summarize/${pdf_id}`, {
			method: 'POST'
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				dialog.open = false;
				output = data.summary;
			})
			.catch((error) => {
				console.error(error);
			});
	}
	function askPDF() {
		operation = 'asking';
		console.log(`http://localhost:8080/api/v1/pdf/ask/${pdf_id}`);
		fetch(`http://localhost:8080/api/v1/pdf/ask/${pdf_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ question })
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				output = data.answer;
			})
			.catch((error) => {
				console.error(error);
			});
	}
</script>

<div class="flex flex-col">
	<input accept="application/pdf" bind:files id="pdf" name="pdf" type="file" />
	<Tabs.Root value="ask-question" class="w-full">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="summarize">Summarize</Tabs.Trigger>
			<Tabs.Trigger value="ask-question">Ask question</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="summarize">
			<Card.Root class="h-64">
				<Card.Header>
					<Card.Title>Summarize</Card.Title>
					<Card.Description>
						Summarize a PDF file. The summary will be displayed here.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button onclick={summarizePDF}>Summarize</Button>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="ask-question">
			<Card.Root class="h-64">
				<Card.Header>
					<Card.Title>Ask question</Card.Title>
					<Card.Description>Ask a question about the PDF file.</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="space-y-1">
						<Label for="question">Your question</Label>
						<Input id="question" type="text" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button onclick={askPDF}>Ask</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
	<div class="border border-red-950">
		{output}
	</div>
	{#if operation}
		<LoaderDialog {operation} />
	{/if}
</div>
