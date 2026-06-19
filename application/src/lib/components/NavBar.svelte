<script lang="ts">
  import ToggleTheme from "./ToggleTheme.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import { fromStore } from "svelte/store";

	interface Props {
    user?: { name: string; role: string } | null;
  }
	let { user = null }: Props = $props();

	const sessionStore = authClient.useSession();
	const session = fromStore(sessionStore); 

	let isLogOut = $state(false);

	async function handleLogOut() {
		isLogOut = true;
		try {
			const { error } = await authClient.signOut();

			if (error) {
				console.log("Logout error:", error)
			} else {
				goto("/sign-in")
			}
		} catch (error) {
			console.error("Unexpected error during logout:", error);
		} finally {
			isLogOut = false;
		}
	}
</script>

<header>
	<nav class="nav">
		<div class="logo">
			<a href="/" class="logo"><h1>File Uploader</h1></a>
		</div>
		<div class="other">
			{#if session.current?.data?.user}
				<ToggleTheme>Theme</ToggleTheme>
				<button class="logout-button" onclick={handleLogOut} disabled={isLogOut}>
				{isLogOut ? "Logging out..." : "Log Out"}</button>
			{:else}
				<a href="/sign-in">Sign in</a>
				<a class="get-started" href="/sign-up">Get started</a>
			{/if}
		</div>
	</nav>
</header>

<style>
	header {
		padding: 10px 20px;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	nav a{
		text-decoration: none;
		color: currentColor;
	}

	nav h1{
		font-size: 1.5rem;
	}

	.other {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.other a{
		padding: 12px;
		font-weight: bold;
		text-decoration: none;
		color: currentColor;
	}

	.other a.get-started {
		color: white;
		background-color: #21A0A0;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(33, 160, 160, 0.3);
		transition: all 0.3s ease;
	}

	.other a:not(.get-started):hover {
		text-decoration: underline;
	}

	.other a.get-started:hover {
		background-color: #1B8585;
		box-shadow: 0 6px 12px rgba(33, 160, 160, 0.4); 
	}

	.logout-button {
		padding: 12px;
		font-weight: bold;
	}

	:global(body) {
		transition: background-color 0.3s ease, color 0.3s ease; 
	}

	:global(body.dark-mode) {
		background-color: oklch(21% 0.034 264.665);
		color: oklch(87.2% 0.01 258.338);
	}
</style>

