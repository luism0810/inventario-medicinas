<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import type { Producto } from '@prisma/client';

	// This interface helps TypeScript understand the shape of the `form` prop,
	// especially when it's returned from a failed action.
	interface FormDataType {
		documento?: string;
		proveedorId?: number;
		error?: string;
		[key: `cantidad_${string}`]: string | undefined;
	}

	type ProductoConCantidad = Producto & { cantidad: string | number };

	export let data: PageData;
	export let form: FormDataType | undefined; // Use our custom type

	const productosConCantidad: ProductoConCantidad[] = data.productos.map((p) => {
		const cantidadKey = `cantidad_${p.id}`;
		const initialCantidad = form?.[cantidadKey] || '0';
		return {
			...p,
			cantidad: initialCantidad
		};
	});

	let searchTerm = '';
	$: filteredProducts = productosConCantidad.filter((p) =>
		p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
	);
	$: hiddenProducts = productosConCantidad.filter(
		(p) => !p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
	);
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
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
		Registrar Nuevo Ingreso
	</h1>
</div>

<div class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
	<form method="POST" use:enhance class="space-y-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="documento" class="block text-sm font-medium text-gray-700"
					>Número de Documento</label
				>
				<input
					type="text"
					name="documento"
					id="documento"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.documento || ''}
					required
				/>
			</div>
			<div>
				<label for="proveedorId" class="block text-sm font-medium text-gray-700">Proveedor</label>
				<select
					name="proveedorId"
					id="proveedorId"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
				>
					<option value="" disabled selected={!form?.proveedorId}>Seleccione un proveedor</option>
					{#each data.proveedores as proveedor}
						<option value={proveedor.id} selected={form?.proveedorId == proveedor.id}>
							{proveedor.nombre}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="pt-4">
			<h2 class="text-lg font-medium text-gray-900 mb-2">Productos</h2>

			<div class="mb-4">
				<label for="search" class="block text-sm font-medium text-gray-700">Buscar Producto</label>
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
								>Cantidad a Ingresar</th
							>
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each filteredProducts as producto (producto.id)}
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
										bind:value={producto.cantidad}
										class="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
									/>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Hidden inputs for products that are filtered out, to ensure their values are submitted -->
		{#each hiddenProducts as producto (producto.id)}
			<input type="hidden" name="cantidad_{producto.id}" value={producto.cantidad} />
		{/each}

		<div class="flex justify-end pt-4">
			<a
				href="/ingresos"
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
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
						clip-rule="evenodd"
					/>
				</svg>
				Guardar Ingreso
			</button>
		</div>
		{#if form?.error}
			<p class="text-red-500 text-sm mt-2 text-center">{form.error}</p>
		{/if}
	</form>
</div>
