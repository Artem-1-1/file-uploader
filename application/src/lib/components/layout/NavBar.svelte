<script lang="ts">
  import ToggleTheme from "./ToggleTheme.svelte";
	import Button from "../ui/Button.svelte";
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import "$lib/styles/global.css"
  import Avatar from "../ui/Avatar.svelte";

	let { user }: { user: any } = $props();

	let isLogOut = $state(false);
	let isDropdownOpen = $state(false);

	const toggleDropdown = (e: MouseEvent) => {
		e.stopPropagation();
		isDropdownOpen =! isDropdownOpen;
	}

	const closeDropdown = () => {
		isDropdownOpen = false;
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
					<form action="/logout" method="POST" 
						use:enhance={() => {
							isLogOut = true;
							return async ({ update }) => {
								try {
									await update();
								} finally {
									isLogOut = false;
								}
							}; 
						}}>
					<div class="logout-btn-wrapper">
						<Button 
							type="submit" 
							variant="primary"
							class="logout-btn" 
							disabled={isLogOut}>
							{#if isLogOut}
								<span class="loading-spinner"></span> Log out...
							{:else}
								Log Out
							{/if}
						</Button>
					</div>
				</form>
				</div>
				{/if}
			</div>
			{:else}
				<Button href="/sign-in" variant="secondary">Sign in</Button>
				<Button href="/sign-up" variant="primary">Get started</Button>
			{/if}
		</div>
	</nav>
</header>

<style>
	header {
		box-sizing: border-box;
		height: 60px;
		padding: 10px 20px;
		background: var(--bg-color, transparent);
		transition: background-color 0.3s ease;  
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: transparent;
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

	.loading-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

	.profile-menu-container {
    position: relative;
    display: inline-block;
  }

	.dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 16px var(--shadow);
		color: var(--text-color);
    padding: 12px;
    min-width: 200px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 8px;
		transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  }

	.user-info {
    display: flex;
    flex-direction: column;
		gap: 4px;
    padding: 4px 8px;
  }

	.username {
    font-weight: 600;
		color: var(--text-color);
  }
	
	.user-email {
    font-size: 14px;
    color: var(--text-muted);
  }

	hr {
    border: 0;
    border-top: 1px solid var(--border-color);
    margin: 4px 0;
  }
</style>

