<script lang="ts">
	import { enhance } from '$app/forms';
	import { generateUniqueFourDigitNumber } from '$lib/utils/codes';
	import { Badge } from '$shadcn/badge';
	import { Button } from '$shadcn/button';
	import * as Table from '$shadcn/table';
	import { toast } from 'svelte-sonner';

	export let data;
	export let form;

	$: codes = new Set(data.existingCodes.map((code) => code.code));

	$: if (form?.success) {
		toast.success(`Code ${newCode} has been set as active`);
		newCode = undefined;
	}

	let newCode: number | undefined = undefined;

	const generateNewCode = () => {
		newCode = generateUniqueFourDigitNumber(codes);
	};

	const numberToDigit = (number: number): string[] => {
		return number
			.toString()
			.split('')
			.map((digit) => digit);
	};

	const humanReadableDate = (date: Date): string => {
		return new Intl.DateTimeFormat('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(date);
	};
</script>

<svelte:head>
	<title>Codes | AccessMate</title>
</svelte:head>

<nav class="mx-auto flex max-w-5xl justify-end px-4 py-4">
	{#if data.user}
		<form action="?/logout" method="post" use:enhance>
			<Button type="submit" variant="secondary" class="flex items-center gap-2">
				<span>Logout</span>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-log-out size-4 stroke-gray-700"
					><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline
						points="16 17 21 12 16 7"
					/>
					<line x1="21" x2="9" y1="12" y2="12" />
				</svg>
			</Button>
		</form>
	{/if}
</nav>

<div class="mx-auto max-w-5xl space-y-12 px-4 py-16">
	<Button size="lg" on:click={generateNewCode}>Generate New Code</Button>

	{#if newCode}
		<div class="flex items-center gap-8">
			<div class="flex gap-2">
				{#each numberToDigit(newCode) as digit}
					<span
						class="flex size-10 items-center justify-center rounded-sm border border-gray-600 font-bold"
					>
						{digit}
					</span>
				{/each}
			</div>

			<form method="post" action="?/setNewCode" use:enhance>
				<input type="hidden" name="code" value={newCode} />
				<Button size="sm" type="submit">Set as Active</Button>
			</form>
		</div>
	{/if}

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Generated on</Table.Head>
				<Table.Head>Code</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.existingCodes as { code, id, createdAt, isActive } (id)}
				<Table.Row>
					<Table.Cell>{humanReadableDate(createdAt)}</Table.Cell>
					<Table.Cell>
						<button
							class="flex items-center gap-2"
							on:click={() => {
								navigator.clipboard.writeText(code.toString());
								toast.success('Code copied to clipboard');
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="lucide lucide-copy size-4 stroke-gray-500"
							>
								<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
									d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
								/>
							</svg>
							<span>{code}</span>
						</button>
					</Table.Cell>
					<Table.Cell>
						<Badge class="rounded-full" variant={isActive ? 'default' : 'secondary'}>
							{isActive ? 'Active' : 'Inactive'}
						</Badge>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
