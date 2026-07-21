<script lang="ts">
  import ToggleTheme from "./ToggleTheme.svelte";
	import Button from "../ui/Button.svelte";
	import { authClient } from "$lib/auth-client";
	import { goto, invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import "$lib/styles/global.css"
  import Avatar from "../ui/Avatar.svelte";

	let { user } = $props<{ user: any }>();

	let isLogOut = $state(false);

	let isDropdownOpen = $state(false);

	const toggleDropdown = (e: MouseEvent) => {
		e.stopPropagation();
		isDropdownOpen =! isDropdownOpen;
	}

	const closeDropdown = () => {
		isDropdownOpen = false;
	}

	async function handleLogOut() {
		isLogOut = true;
		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: async () => {
						await invalidateAll();
						await goto("/")
					}
				}
			});
		} catch (error) {
			console.error("Unexpected error during logout:", error);
		} finally {
			isLogOut = false;
		}
	}
</script>

<svelte:window onclick={closeDropdown}/>

<header>
	<nav class="nav">
		<div class="logo">
			<a href="/" class="logo"><h1>File Uploader</h1></a>
		</div>
		<div class="other">
			{#if user}
				<ToggleTheme/>
				{#if $page.url.pathname === '/admin'}
          <a href="/home" data-sveltekit-preload-data="false">Home</a>
        {:else if user.role === "admin"}
          <a href="/admin" data-sveltekit-preload-data="false">Admin Panel</a>
        {/if}
				<div class="profile-menu-container">
					<Avatar src={user.image} name={user.name} size={36} onclick={toggleDropdown}/>
				{#if isDropdownOpen}
				<div class="dropdown-menu"
						role="presentation"
						onclick={(e) => e.stopPropagation()}
						onkeydown={(e) => e.stopPropagation()}>
					<div class="user-info">
						<div class="username">{user.name}</div>
						<div class="user-email">{user.email}</div>
					</div>
					<hr />
					<a href="/account">Settings</a>
					<Button variant="primary" class="logout-button" onclick={handleLogOut} disabled={isLogOut}>
						{isLogOut ? "Logging out..." : "Log Out"}
					</Button>
				</div>
				{/if}
			</div>
			{:else}
				<ToggleTheme/>
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

	.profile-menu-container {
    position: relative;
    display: inline-block;
  }

	.dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: var(--dropdown-bg);
    border: 1px solid var(--dropdown-border);
    border-radius: 8px;
    box-shadow: 0 4px 16px var(--shadow-dropdown);
		color: var(--text-dropdown-main);
    padding: 12px;
    min-width: 200px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 8px;

		background-color: var(--dropdown-bg);
		border: 1px solid var(--dropdown-border);
		box-shadow: 0 4px 16px var(--shadow-dropdown);
		color: var(--dropdown-text-main);
		transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  }

	.user-info {
    display: flex;
    flex-direction: column;
		gap: 5px;
    font-size: 14px;
  }

	.username {
    font-weight: 600;
		color: var(--dropdown-text-main);
  }
	
	.user-email {
    font-size: 14px;
    color: var(--dropdown-text-muted);
  }

	hr {
    border: 0;
    border-top: 1px solid var(--dropdown-hr);
    margin: 4px 0;
  }
</style>

