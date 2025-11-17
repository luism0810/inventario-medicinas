<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: totalSalida = data.salida.productos.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

	function printPage() {
		window.print();
	}
</script>

<svelte:head>
	<title>Recibo de Salida #{data.salida.id}</title>
	<style>
		@media print {
			button {
				display: none;
			}
		}
	</style>
</svelte:head>

<div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
	<div class="text-center mb-6">
		<h1 class="text-3xl font-bold text-gray-800 mb-2">Recibo de Salida</h1>
		<p class="text-gray-600">Fecha: {new Date(data.salida.fecha).toLocaleDateString()}</p>
	</div>

	<div class="mb-6 border-b pb-4">
		<p class="text-right"><strong>Número de Salida:</strong> <span class="underline">{data.salida.id}</span></p>
		{#if data.salida.documento}
			<p><strong>Documento:</strong> {data.salida.documento}</p>
		{/if}
		<p><strong>Cliente:</strong> {data.salida.cliente.nombre}</p>
		{#if data.salida.cliente.codigo}
			<p><strong>Código Cliente:</strong> {data.salida.cliente.codigo}</p>
		{/if}
		<p><strong>Dirección:</strong> {data.salida.cliente.direccion}</p>
		<p><strong>Responsable:</strong> {data.salida.cliente.responsable}</p>
		<p><strong>Cédula/Rif:</strong> {data.salida.cliente.cedulaRif}</p>
	</div>

	<div class="mb-6 border-b pb-4">
		<h2 class="text-xl font-semibold text-gray-700 mb-2">Detalle de Productos</h2>
		<table class="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
					<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
				</tr>
			</thead>
			<tbody class="bg-white divide-y divide-gray-200">
				{#each data.salida.productos as item}
					<tr>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.producto.nombre}</td>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.cantidad}</td>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.precio.toFixed(2)}</td>
						<td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{(item.cantidad * item.precio).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="text-right mb-6">
		<p class="text-xl font-semibold text-gray-800">Total: ${totalSalida.toFixed(2)}</p>
	</div>

	<div class="text-center">
		<button
			on:click={printPage}
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 print:hidden"
		>
			Imprimir Recibo
		</button>
	</div>
</div>