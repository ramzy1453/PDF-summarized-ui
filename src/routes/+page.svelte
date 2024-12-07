<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.ts';
	import { Input } from '$lib/components/ui/input/index.ts';
	import { Label } from '$lib/components/ui/label/index.ts';
	import * as Tabs from '$lib/components/ui/tabs/index.ts';
	import * as Card from '$lib/components/ui/card/index.ts';
	let files: FileList | null | undefined = $state();
	let output = $state(
		'Upload a PDF file to summarize it. The summary will be displayed here. You can also ask a question about the PDF.'
	);
	let question = $state('');
	let pdf_id = $state('');
	$inspect(files);
	$inspect(pdf_id);

	function uploadPDF() {
		const formData = new FormData();
		formData.append('pdf', files?.[0] as Blob);

		fetch('http://localhost:8080/api/v1/pdf/upload', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then((data) => {
				pdf_id = data.pdf_id;
				output = 'PDF uploaded successfully';
				console.log(data);
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
		output = 'Summarizing...';
		console.log(`http://localhost:8080/api/v1/pdf/summarize/${pdf_id}`);
		fetch(`http://localhost:8080/api/v1/pdf/summarize/${pdf_id}`, {
			method: 'POST'
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				output = data.summary;
			})
			.catch((error) => {
				console.error(error);
			});
	}
	function askPDF() {
		output = 'Asking...';
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

<div class="">
	<Tabs.Root value="account" class="w-[400px]">
		<Tabs.List class="grid w-full grid-cols-2">
			<Tabs.Trigger value="account">Account</Tabs.Trigger>
			<Tabs.Trigger value="password">Password</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="account">
			<Card.Root>
				<Card.Header>
					<Card.Title>Account</Card.Title>
					<Card.Description>
						Make changes to your account here. Click save when you're done.
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="space-y-1">
						<Label for="name">Name</Label>
						<Input id="name" value="Pedro Duarte" />
					</div>
					<div class="space-y-1">
						<Label for="username">Username</Label>
						<Input id="username" value="@peduarte" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button>Save changes</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="password">
			<Card.Root>
				<Card.Header>
					<Card.Title>Password</Card.Title>
					<Card.Description>
						Change your password here. After saving, you'll be logged out.
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="space-y-1">
						<Label for="current">Current password</Label>
						<Input id="current" type="password" />
					</div>
					<div class="space-y-1">
						<Label for="new">New password</Label>
						<Input id="new" type="password" />
					</div>
				</Card.Content>
				<Card.Footer>
					<Button>Save password</Button>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</div>
