<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import { Toaster, toast } from 'svelte-sonner';
	import SummarizeTab from '$components/PDFTabs/SummarizeTab.svelte';
	import AskTab from '$components/PDFTabs/AskTab.svelte';
	import Conversation from '$components/Conversation/index.svelte';

	import LoaderDialog from '$components/LoaderDialog/index.svelte';

	import { dialog } from '$lib/store/index.svelte';
	import { PDFApi } from '$lib/api/index.ts';
	import type { IConversation } from '$types/index.d.ts';

	let files: FileList | null | undefined = $state();
	let question = $state('');
	let pdfId: string | undefined = $state();

	let actualTab = $state('summarize');
	let output = $state('No output yet. Summarize a PDF file or ask a question to get started.');

	let conversations: IConversation[] = $state.raw([]);

	async function uploadPDF() {
		const formData = new FormData();
		formData.append('pdf', files?.[0] as Blob);
		dialog.open = true;

		try {
			const uploadedPDF = await PDFApi.uploadPDF(formData);
			console.log(uploadedPDF);
			pdfId = uploadedPDF.pdf_id;
			dialog.open = false;
			dialog.text = 'Uploading...';
			conversations = [];
			toast.success('PDF summarized successfully', {
				duration: 2000,
				class: 'text-green-500'
			});
		} catch (e: any) {
			dialog.open = false;
			toast.error(e.message, {
				duration: 2000,
				class: 'text-red-500'
			});
		}
	}

	$effect(() => {
		if (files && files.length > 0) {
			uploadPDF();
		}
	});

	$effect(() => {
		if (actualTab) {
			output = 'No output yet. Summarize a PDF file or ask a question to get started.';
		}
	});

	async function summarizePDF() {
		try {
			dialog.open = true;
			dialog.text = 'Generating...';
			const summary = await PDFApi.summarizePDF(pdfId!);
			dialog.open = false;
			output = summary;
			conversations = [...conversations, { response: summary, request: 'Summarize the PDF' }];
			question = '';
		} catch (e: any) {
			toast.error(e.message, {
				duration: 2000,
				class: 'text-red-500'
			});
		} finally {
			dialog.open = false;
		}
	}
	async function askPDF() {
		dialog.open = true;
		dialog.text = 'Generating...';

		try {
			const answer = await PDFApi.askQuestion(pdfId!, question);
			output = answer;
			conversations = [...conversations, { request: question, response: answer }];
		} catch (e: any) {
			toast.error(e.message, {
				duration: 2000,
				class: 'text-red-500'
			});
		} finally {
			dialog.open = false;
		}
	}
</script>

<Toaster />
<div class="flex flex-col space-y-4" style="height: calc(100vh - 80px);">
	<div class="flex-1 space-y-2">
		<input
			id="pdf"
			type="file"
			class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-background file:bg-transparent file:text-sm file:font-medium file:text-primary placeholder:text-muted-foreground hover:file:bg-green-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
				<AskTab {askPDF} bind:question />
			</Tabs.Content>
		</Tabs.Root>
		<LoaderDialog />
	</div>

	<Conversation {output} {conversations} />
</div>
