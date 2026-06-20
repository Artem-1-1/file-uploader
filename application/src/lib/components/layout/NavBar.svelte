<script lang="ts">
  import ToggleTheme from "./ToggleTheme.svelte";
	import Button from "../ui/Button.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";
	import { fromStore } from "svelte/store";
	import "$lib/styles/global.css"

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
				<ToggleTheme/>
				<Button variant="primary" class="logout-button" onclick={handleLogOut} disabled={isLogOut}>
				{isLogOut ? "Logging out..." : "Log Out"}
				</Button>
			{:else}
				<Button href="/sign-in" variant="secondary">Sign in</Button>
				<Button href="/sign-up" variant="primary">Get started</Button>
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
</style>

