<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<nav class="bg-white shadow-md">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<a href="/" class="text-xl font-bold text-indigo-600">PharmaSys</a>
					</div>
					{#if data.user}
						<div class="hidden md:block">
							<div class="ml-10 flex items-baseline space-x-4">
								<a
									href="/productos"
									class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
									>Productos</a
								>
								<a
									href="/clientes"
									class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
									>Clientes</a
								>
								<a
									href="/proveedores"
									class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
									>Proveedores</a
								>
								<a
									href="/ingresos"
									class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
									>Ingresos</a
								>
								<a
									href="/salidas"
									class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
									>Salidas</a
								>

								{#if data.user.role === 'ADMIN'}
									<div class="border-l border-gray-300 h-6 mx-3"></div>
									<a
										href="/admin/users"
										class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
										>Usuarios</a
									>
									<a
										href="/admin/audit-log"
										class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
										>Audit Log</a
									>
								{/if}
							</div>
						</div>
					{/if}
				</div>
				{#if data.user}
					<div class="hidden md:block">
						<div class="ml-4 flex items-center md:ml-6">
							<span class="text-gray-700 text-sm mr-4">Hola, {data.user.username}</span>
							<a
								href="/logout"
								class="text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
								>Cerrar Sesión</a
							>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</nav>

	<main class="py-10">
		<div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
			<slot />
		</div>
	</main>
</div>
