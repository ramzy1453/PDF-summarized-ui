<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	import { Toaster, toast } from 'svelte-sonner';
	import SvelteMarkdown from 'svelte-markdown';
	import SummarizeTab from '$components/PDFTabs/SummarizeTab.svelte';
	import AskTab from '$components/PDFTabs/AskTab.svelte';

	import LoaderDialog from '$components/LoaderDialog/index.svelte';

	import { dialog } from '$lib/store/index.svelte';

	let files: FileList | null | undefined = $state();
	let question = $state('');
	let pdfId = $state('');

	let actualTab = $state('summarize');
	let output = $state('No output yet. Summarize a PDF file or ask a question to get started.');

	function uploadPDF() {
		const formData = new FormData();
		formData.append('pdf', files?.[0] as Blob);
		console.log(formData);
		dialog.open = true;
		fetch('http://localhost:8080/api/v1/pdf/upload', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				pdfId = data.pdf_id;
				dialog.open = false;
				dialog.text = 'Uploading...';
				toast.success('PDF summarized successfully', {
					duration: 2000,
					class: 'text-green-500'
				});
			})
			.catch((error) => {
				console.error(error);
			});
	}

	$effect(() => {
		if (files && files.length > 0) {
			uploadPDF();
		}
	});

	// reset output when tab changes
	$effect(() => {
		if (actualTab) {
			output = 'No output yet. Summarize a PDF file or ask a question to get started.';
		}
	});

	$inspect(actualTab);
	$inspect(pdfId);

	function summarizePDF() {
		dialog.open = true;
		dialog.text = 'Generating...';
		console.log(`http://localhost:8080/api/v1/pdf/summarize/${pdfId}`);
		fetch(`http://localhost:8080/api/v1/pdf/summarize/${pdfId}`, {
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
		dialog.text = 'Generating...';
		dialog.open = true;
		console.log(JSON.stringify({ question }));
		fetch(`http://localhost:8080/api/v1/pdf/ask/${pdfId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ question })
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				dialog.open = false;
				output = data.answer;
			})
			.catch((error) => {
				console.error(error);
			});
	}
</script>

<Toaster />
<div class="flex flex-col space-y-6">
	<input
		id="pdf"
		type="file"
		class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-blue-50 file:bg-transparent file:text-sm file:font-medium file:text-blue-700 placeholder:text-muted-foreground hover:file:bg-blue-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
		bind:files
		accept="application/pdf"
	/>

	<Tabs.Root
		value={actualTab}
		onValueChange={(value) => {
			actualTab = value!;
		}}
		class="w-full"
	>
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="summarize">Summarize</Tabs.Trigger>
			<Tabs.Trigger value="ask-question">Ask question</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="summarize">
			<SummarizeTab {summarizePDF} />
		</Tabs.Content>
		<Tabs.Content value="ask-question">
			<AskTab {askPDF} {question} />
		</Tabs.Content>
	</Tabs.Root>

	<div class="borde rounded-lg p-3 shadow">
		<SvelteMarkdown source={output} />
	</div>
	<LoaderDialog />
</div>
