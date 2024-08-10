<script lang="ts">
	import '../app.css';

	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher defaultMode="light" />
<Toaster richColors={true} />

<slot></slot>
