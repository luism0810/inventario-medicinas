<!-- src/routes/salidas/nuevo/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	// Define a more specific type for the form data when it's returned from a failed action
	interface FormDataType {
		clienteId?: number;
		error?: string;
		// Allow dynamic properties like 'cantidad_1', 'cantidad_2', etc.
		[key: `cantidad_${number}`]: string | undefined;
	}

	export let data: PageData;
	export let form: FormDataType | undefined; // form can be be undefined initially or on success

	// Search for products
	let searchTerm = '';
	$: filteredProducts = data.productos.filter((p) =>
		p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Search for clients
	let clienteSearchTerm = '';
	$: filteredClientes = data.clientes.filter((c) =>
		c.nombre.toLowerCase().includes(clienteSearchTerm.toLowerCase())
	);

	// Use an object to store quantities, keyed by producto.id
	let cantidades: { [key: number]: number } = {};

	// Initialize quantities from form data if available (e.g., after a validation error)
	if (form) {
		for (const key in form) {
			if (key.startsWith('cantidad_')) {
				const productoId = Number(key.split('_')[1]);
				const value = form[key as `cantidad_${number}`];
				if (value) {
					cantidades[productoId] = Number(value);
				}
			}
		}
	}
</script>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold text-gray-800 flex items-center">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 mr-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<!-- Using a different icon for "out" -->
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
			/>
		</svg>
		Registrar Nueva Salida
	</h1>
</div>

<div class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
	<form method="POST" use:enhance class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="search-cliente" class="block text-sm font-medium text-gray-700"
					>Buscar Cliente</label
				>
				<input
					type="text"
					id="search-cliente"
					bind:value={clienteSearchTerm}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="Escriba para filtrar cliente..."
				/>
				<label for="clienteId" class="block text-sm font-medium text-gray-700 mt-2"
					>Cliente</label
				>
				<select
					name="clienteId"
					id="clienteId"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
				>
					<option value="" disabled selected={!form?.clienteId}>Seleccione un cliente</option>
					{#each filteredClientes as cliente}
						<option value={cliente.id} selected={form?.clienteId == cliente.id}>
							{cliente.nombre}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="pt-4">
			<h2 class="text-lg font-medium text-gray-900 mb-2">Productos</h2>

			<div class="mb-4">
				<label for="search" class="block text-sm font-medium text-gray-700"
					>Buscar Producto</label
				>
				<input
					type="text"
					id="search"
					bind:value={searchTerm}
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="Escriba para filtrar..."
				/>
			</div>

			<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>Producto</th
							>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>Existencia Actual</th
							>
							<th
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40"
								>Cantidad a Egresar</th
							>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredProducts as producto}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-gray-900">{producto.nombre}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-500">{producto.existencia}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<input
										type="number"
										name={`cantidad_${producto.id}`}
										min="0"
										max={producto.existencia}
										bind:value={cantidades[producto.id]}
										class="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<a
				href="/salidas"
				class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-3 hover:bg-gray-300 transition-colors"
			>
				Cancelar
			</a>
			<button
				type="submit"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-2"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						d="M10.894 2.553a1 1 0 00-1.789 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
					/>
				</svg>
				Guardar Salida
			</button>
		</div>
		{#if form?.error}
			<p class="text-red-500 text-sm mt-2 text-center">{form.error}</p>
		{/if}
	</form>
</div>
