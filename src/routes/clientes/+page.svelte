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

	let selectedCliente: any = null;

	function openModal(cliente: any) {
		selectedCliente = cliente;
	}

	function closeModal() {
		selectedCliente = null;
	}
</script>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-2xl font-bold text-gray-800">Listado de Clientes</h1>
	<a
		href="/clientes/nuevo"
		class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 mr-2"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
		</svg>
		Agregar Cliente
	</a>
</div>

<div class="mb-4">
	<input
		type="search"
		bind:value={searchTerm}
		placeholder="Buscar por nombre..."
		class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
	/>
</div>

{#if data.clientes.length}
	<!-- Vista Desktop (Tabla) -->
	<div class="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
		<div class="overflow-x-auto">
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
							>Código</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Responsable</th
						>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>Cédula/RIF</th
						>
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
								<div class="text-sm text-gray-900">{cliente.codigo || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{cliente.responsable || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900">{cliente.cedulaRif || '-'}</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
								<div class="flex items-center justify-end space-x-3">
									<button
										type="button"
										class="text-blue-600 hover:text-blue-900"
										title="Ver Detalles"
										on:click={() => openModal(cliente)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
											<path
												fill-rule="evenodd"
												d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</button>
									<a
										href={`/clientes/${cliente.id}`}
										class="text-indigo-600 hover:text-indigo-900"
										title="Editar"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
											/>
											<path
												fill-rule="evenodd"
												d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
												clip-rule="evenodd"
											/>
										</svg>
									</a>
									<form method="POST" action="?/delete" use:enhance class="inline-block">
										<input type="hidden" name="id" value={cliente.id} />
										<button
											type="submit"
											class="text-red-600 hover:text-red-900"
											title="Eliminar"
											on:click={(e) =>
												!confirm('¿Estás seguro de eliminar este cliente?') && e.preventDefault()}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
													clip-rule="evenodd"
												/>
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
	</div>

	<!-- Vista Mobile (Cards) -->
	<div class="md:hidden grid grid-cols-1 gap-4">
		{#each data.clientes as cliente}
			<div class="bg-white shadow rounded-lg p-4 border border-gray-200">
				<div class="flex justify-between items-start mb-2">
					<div>
						<h3 class="text-lg font-semibold text-gray-900">{cliente.nombre}</h3>
						<p class="text-sm text-gray-500 font-mono">{cliente.codigo || 'Sin código'}</p>
					</div>
				</div>

				<div class="space-y-2 text-sm text-gray-700 mb-4">
					{#if cliente.direccion}
						<div class="flex items-start">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-400 mr-2 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span>{cliente.direccion}</span>
						</div>
					{/if}
					{#if cliente.responsable}
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-400 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							<span>{cliente.responsable}</span>
						</div>
					{/if}
					{#if cliente.cedulaRif}
						<div class="flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-gray-400 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.56 1.613-1.333 1.916"
								/>
							</svg>
							<span>{cliente.cedulaRif}</span>
						</div>
					{/if}
				</div>

				<div class="border-t border-gray-100 pt-3 flex justify-end space-x-4">
					<a
						href={`/clientes/${cliente.id}`}
						class="flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mr-1"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
							/>
							<path
								fill-rule="evenodd"
								d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
								clip-rule="evenodd"
							/>
						</svg>
						Editar
					</a>
					<form method="POST" action="?/delete" use:enhance class="inline-block">
						<input type="hidden" name="id" value={cliente.id} />
						<button
							type="submit"
							class="flex items-center text-red-600 hover:text-red-900 font-medium"
							on:click={(e) =>
								!confirm('¿Estás seguro de eliminar este cliente?') && e.preventDefault()}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 mr-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
									clip-rule="evenodd"
								/>
							</svg>
							Eliminar
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div class="text-center py-12">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mx-auto h-12 w-12 text-gray-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197"
			/>
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
			<a
				href="/clientes/nuevo"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Agregar Cliente
			</a>
		</div>
	</div>
{/if}

{#if selectedCliente}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
		>
			<div
				class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
				aria-hidden="true"
				on:click={closeModal}
			></div>

			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
				>&#8203;</span
			>

			<div
				class="relative z-10 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
			>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div
							class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 text-indigo-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
							<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
								Detalles del Cliente
							</h3>
							<div class="mt-4 space-y-3">
								<div>
									<span class="block text-sm font-medium text-gray-500">Nombre</span>
									<p class="mt-1 text-sm text-gray-900 font-semibold">{selectedCliente.nombre}</p>
								</div>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<span class="block text-sm font-medium text-gray-500">Código</span>
										<p class="mt-1 text-sm text-gray-900">{selectedCliente.codigo || '-'}</p>
									</div>
									<div>
										<span class="block text-sm font-medium text-gray-500">Cédula/RIF</span>
										<p class="mt-1 text-sm text-gray-900">{selectedCliente.cedulaRif || '-'}</p>
									</div>
								</div>
								<div>
									<span class="block text-sm font-medium text-gray-500">Responsable</span>
									<p class="mt-1 text-sm text-gray-900">{selectedCliente.responsable || '-'}</p>
								</div>
								<div class="bg-gray-50 p-3 rounded-md">
									<span class="block text-sm font-medium text-gray-500 mb-1">Dirección</span>
									<p class="text-sm text-gray-900 whitespace-pre-wrap">
										{selectedCliente.direccion || 'Sin dirección registrada'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<button
						type="button"
						class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
						on:click={closeModal}
					>
						Cerrar
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
