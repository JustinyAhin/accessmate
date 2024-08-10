<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$shadcn/button';
	import * as Card from '$shadcn/card';
	import { Input } from '$shadcn/input';
	import { toast } from 'svelte-sonner';

	export let form;

	$: if (form?.type === 'error') {
		toast.error(form.message);
	}
</script>

<svelte:head>
	<title>Login | AccessMate</title>
</svelte:head>

<div class="mx-auto flex min-h-screen flex-col items-center justify-center px-4 sm:w-4/12">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Login</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance class="space-y-4">
				<Input name="email" type="email" placeholder="Email" required />
				<Input name="password" type="password" placeholder="Password" required />

				<Button type="submit" class="w-full">Login</Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
