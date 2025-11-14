<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { debounce } from '$lib/utils';

	export let data: PageData;

	let searchTerm = data.q ?? '';

	const debouncedSearch = debounce((value: string) => {
		const url = value ? `/clientes?q=${encodeURIComponent(value)}` : '/clientes';
		goto(url, { keepFocus: true, replaceState: true });
	}, 300);

	$: if (browser) {
		debouncedSearch(searchTerm);
	}
</script>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-2xl font-bold text-gray-800">Listado de Clientes</h1>
	<a href="/clientes/nuevo" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
		</svg>
		Agregar Cliente
	</a>
</div>

<div class="mb-4">
    <input type="search" bind:value={searchTerm} placeholder="Buscar por nombre..." class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
</div>

{#if data.clientes.length}
	<div class="bg-white shadow-md rounded-lg overflow-hidden">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula/RIF</th>
					<th scope="col" class="relative px-6 py-3">
						<span class="sr-only">Acciones</span>
					</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data.clientes as cliente}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">{cliente.nombre}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{cliente.codigo}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{cliente.direccion}</div>
						</td>
                        <td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{cliente.responsable}</div>
						</td>
                        <td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{cliente.cedulaRif}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<div class="flex items-center justify-end space-x-3">
								<a href={`/clientes/${cliente.id}`} class="text-indigo-600 hover:text-indigo-900" title="Editar">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
										<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
									</svg>
								</a>
								<form method="POST" action="?/delete" use:enhance class="inline-block">
									<input type="hidden" name="id" value={cliente.id} />
									<button type="submit" class="text-red-600 hover:text-red-900" title="Eliminar">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
										</svg>
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="text-center py-12">
		<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" />
		</svg>
		<h3 class="mt-2 text-sm font-medium text-gray-900">
			{#if data.q}
				No se encontraron clientes para "{data.q}"
			{:else}
				No hay clientes
			{/if}
		</h3>
		<p class="mt-1 text-sm text-gray-500">
			{#if !data.q}
				Empieza por agregar un nuevo cliente.
			{/if}
		</p>
		<div class="mt-6">
			<a href="/clientes/nuevo" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Agregar Cliente
			</a>
		</div>
	</div>
{/if}
