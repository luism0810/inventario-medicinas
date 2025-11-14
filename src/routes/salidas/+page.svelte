<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-2xl font-bold text-gray-800">Historial de Salidas</h1>
	<a href="/salidas/nuevo" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
		</svg>
		Registrar Salida
	</a>
</div>

{#if data.salidas.length}
	<div class="bg-white shadow-md rounded-lg overflow-hidden">
		<table class="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Salida</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
					<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data.salidas as salida}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm font-medium text-gray-900">
                                {salida.id}
                                {#if salida.documento}
                                    <span class="text-gray-500 text-xs">(Doc: {salida.documento})</span>
                                {/if}
                            </div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{salida.cliente.nombre}</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{new Date(salida.fecha).toLocaleDateString()}</div>
						</td>
						<td class="px-6 py-4 align-top">
							<table class="min-w-full">
								<tbody>
									{#each salida.productos as item}
										<tr>
											<td class="pr-2 text-sm text-gray-700">{item.cantidad}</td>
											<td class="text-sm text-gray-700 font-medium">{item.producto.nombre}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
							<a href="/salidas/{salida.id}/print" target="_blank" class="text-indigo-600 hover:text-indigo-900">Ver Recibo</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
        <footer class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
                <a href={`/salidas?page=${data.currentPage > 1 ? data.currentPage - 1 : 1}`} class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Anterior</a>
                <a href={`/salidas?page=${data.currentPage < data.totalPages ? data.currentPage + 1 : data.totalPages}`} class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Siguiente</a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Página
                        <span class="font-medium">{data.currentPage}</span>
                        de
                        <span class="font-medium">{data.totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex flex-wrap rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href={`/salidas?page=${data.currentPage > 1 ? data.currentPage - 1 : 1}`} class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span class="sr-only">Anterior</span>
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                        {#each Array.from({ length: data.totalPages }, (_, i) => i + 1) as page}
                            <a href={`/salidas?page=${page}`} aria-current={page === data.currentPage ? 'page' : undefined} class:bg-indigo-50={page === data.currentPage} class:border-indigo-500={page === data.currentPage} class:text-indigo-600={page === data.currentPage} class:bg-white={page !== data.currentPage} class:border-gray-300={page !== data.currentPage} class:text-gray-500={page !== data.currentPage} class:hover:bg-gray-50={page !== data.currentPage} class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                {page}
                            </a>
                        {/each}
                        <a href={`/salidas?page=${data.currentPage < data.totalPages ? data.currentPage + 1 : data.totalPages}`} class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                            <span class="sr-only">Siguiente</span>
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
	</div>
{:else}
	<div class="text-center py-12">
		<svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
		</svg>
		<h3 class="mt-2 text-sm font-medium text-gray-900">No hay salidas</h3>
		<p class="mt-1 text-sm text-gray-500">Empieza por registrar una nueva salida de mercancía.</p>
		<div class="mt-6">
			<a href="/salidas/nuevo" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Registrar Salida
			</a>
		</div>
	</div>
{/if}