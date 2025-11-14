<script lang="ts">
	import type { PageData } from './$types';
	import {
		Box,
		ClipboardList,
		Users,
		Truck,
		LogIn,
		LogOut,
		FileText,
		Archive
	} from 'lucide-svelte';

	export let data: PageData;
	const { user, lowStockProducts } = data;

	const mainMenuItems = [
		{
			href: '/productos',
			title: 'Productos',
			icon: Box,
			description: 'Gestiona tu inventario de productos.'
		},
		{
			href: '/clientes',
			title: 'Clientes',
			icon: Users,
			description: 'Administra la información de tus clientes.'
		},
		{
			href: '/proveedores',
			title: 'Proveedores',
			icon: Truck,
			description: 'Lleva un registro de tus proveedores.'
		},
		{
			href: '/ingresos',
			title: 'Ingresos',
			icon: LogIn,
			description: 'Registra las entradas de nuevos productos.'
		},
		{
			href: '/salidas',
			title: 'Salidas',
			icon: LogOut,
			description: 'Registra las ventas y salidas de productos.'
		}
	];

	const adminMenuItems = [
		{
			href: '/admin/users',
			title: 'Usuarios',
			icon: Users,
			description: 'Gestiona los usuarios del sistema.'
		},
		{
			href: '/admin/audit-log',
			title: 'Audit Log',
			icon: FileText,
			description: 'Revisa los registros de auditoría del sistema.'
		}
	];
</script>

<div class="space-y-8">
	<div class="bg-white shadow-md rounded-lg p-6 border-l-4 border-indigo-500">
		<h1 class="text-3xl font-bold text-gray-800">¡Bienvenido, {user?.username}!</h1>
		<p class="text-gray-600 mt-1">Aquí tienes un resumen de tu sistema.</p>
	</div>

	<!-- Quick Actions -->
	<div>
		<h2 class="text-2xl font-semibold text-gray-700 mb-4">Acciones Rápidas</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each mainMenuItems as item}
				<a
					href={item.href}
					class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-start space-x-4"
				>
					<div class="bg-indigo-100 p-3 rounded-full">
						<svelte:component this={item.icon} class="h-6 w-6 text-indigo-600" />
					</div>
					<div>
						<h3 class="text-lg font-semibold text-gray-800">{item.title}</h3>
						<p class="text-gray-500 text-sm">{item.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Admin Section -->
	{#if user?.role === 'ADMIN'}
		<div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-4">Administración</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each adminMenuItems as item}
					<a
						href={item.href}
						class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-start space-x-4"
					>
						<div class="bg-purple-100 p-3 rounded-full">
							<svelte:component this={item.icon} class="h-6 w-6 text-purple-600" />
						</div>
						<div>
							<h3 class="text-lg font-semibold text-gray-800">{item.title}</h3>
							<p class="text-gray-500 text-sm">{item.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Low Stock Products -->
	{#if lowStockProducts && lowStockProducts.length > 0}
		<div>
			<h2 class="text-2xl font-semibold text-gray-700 mb-4">Productos con Bajo Stock</h2>
			<div class="bg-white shadow-md rounded-lg overflow-hidden">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>Nombre</th
							>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>Existencia</th
							>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>Stock Mínimo</th
							>
							<th scope="col" class="relative px-6 py-3">
								<span class="sr-only">Ver</span>
							</th>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each lowStockProducts as producto}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
									>{producto.nombre}</td
								>
								<td class="px-6 py-4 whitespace-nowrap text-sm">
									<span
										class="font-semibold"
										class:text-red-600={producto.existencia < producto.stock_minimo}
										class:text-yellow-600={producto.existencia === producto.stock_minimo}
									>
										{producto.existencia}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>{producto.stock_minimo}</td
								>
								<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
									<a href={`/productos/${producto.id}`} class="text-indigo-600 hover:text-indigo-900"
										>Ver</a
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<div class="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
			<div class="flex items-center">
				<div class="bg-green-100 p-3 rounded-full mr-4">
					<Archive class="h-6 w-6 text-green-600" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-800">¡Todo en orden!</h3>
					<p class="text-gray-600">No hay productos con bajo stock en este momento.</p>
				</div>
			</div>
		</div>
	{/if}
</div>