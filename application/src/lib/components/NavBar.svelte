<script lang="ts">
	let { user } : {user: {name: string} | null } = $props();
</script>

<header>
	<nav class="nav">
		<div class="logo">
			<a href="/" class="logo"><h1>File Uploader</h1></a>
		</div>
		<div class="other">
			<a href="/sign-in">Sign in</a>
			<a class="get-started" href="/sign-up">Get started</a>
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
		color: black;
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
		color: black
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
	.get-started:hover {
		background-color: #1B8585;
		box-shadow: 0 6px 12px rgba(33, 160, 160, 0.4); 
	}
</style>

