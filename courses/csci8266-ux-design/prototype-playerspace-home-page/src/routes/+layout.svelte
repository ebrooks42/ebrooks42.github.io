<script lang="ts">
	import './layout.css';

	let { children } = $props();
	let activePage = $state('home');
</script>

<svelte:head>
	<link rel="icon" href="https://cdn.playerspace.com/assets/faviconymca.ico" />
	<title>Team Jaguar - Player Space</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header Section -->
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center">
				<!-- Logo and Team Info -->
				<div class="flex items-center gap-6">
					<!-- YMCA Logo -->
					<img src="/ymca_logo.png" alt="YMCA Logo" class="h-20 w-20 flex-shrink-0 rounded" />

					<!-- Team Details -->
					<div>
						<h1 class="text-2xl font-bold text-gray-900">Team Jaguar</h1>
						<p class="text-sm text-gray-600">Omaha, NE</p>
						<p class="text-sm font-medium text-gray-800">
							Coach: <span class="text-gray-700">Evan Brooks</span>
						</p>
						<p class="text-sm text-gray-600">Division: Preschool (3-4 yr Old) Co-Ed</p>
					</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Navigation Menu -->
	<nav class="bg-blue-600 shadow-md">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex space-x-8">
				<button
					onclick={() => (activePage = 'home')}
					class={`border-b-4 px-3 py-4 text-sm font-medium transition-colors ${
						activePage === 'home'
							? 'border-white text-white'
							: 'border-transparent text-blue-100 hover:text-white'
					}`}
				>
					Home
				</button>
				<button
					onclick={() => (activePage = 'roster')}
					class={`border-b-4 px-3 py-4 text-sm font-medium transition-colors ${
						activePage === 'roster'
							? 'border-white text-white'
							: 'border-transparent text-blue-100 hover:text-white'
					}`}
				>
					Roster
				</button>
				<button
					onclick={() => (activePage = 'activity')}
					class={`border-b-4 px-3 py-4 text-sm font-medium transition-colors ${
						activePage === 'activity'
							? 'border-white text-white'
							: 'border-transparent text-blue-100 hover:text-white'
					}`}
				>
					Activity
				</button>
				<button
					onclick={() => (activePage = 'coach')}
					class={`border-b-4 px-3 py-4 text-sm font-medium transition-colors ${
						activePage === 'coach'
							? 'border-white text-white'
							: 'border-transparent text-blue-100 hover:text-white'
					}`}
				>
					Coach's Corner
				</button>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{@render children()}
	</main>
</div>
