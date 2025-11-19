<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import pkg from '@prisma/client';
	const { Presentacion } = pkg;

	export let data: PageData;
	export let form: ActionData;
</script>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold text-gray-800 flex items-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
		</svg>
		Editar Producto
	</h1>
</div>

<div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
	<form method="POST" action="?/update" use:enhance class="space-y-6">
		<div>
			<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Producto</label>
			<div class="mt-1">
				<input
					type="text"
					name="nombre"
					id="nombre"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="Ej: Paracetamol 500mg"
					value={form?.nombre || data.producto.nombre}
					required
				/>
			</div>
		</div>

		<div>
			<label for="presentacion" class="block text-sm font-medium text-gray-700">Presentación</label>
			<div class="mt-1">
				<select
					name="presentacion"
					id="presentacion"
					class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					required
				>
					{#each Object.values(Presentacion) as presentacionOption}
						<option value={presentacionOption} selected={data.producto.presentacion === presentacionOption}>{presentacionOption}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label for="precio" class="block text-sm font-medium text-gray-700">Precio</label>
			<div class="mt-1 relative rounded-md shadow-sm">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<span class="text-gray-500 sm:text-sm">$</span>
				</div>
				<input
					type="number"
					name="precio"
					id="precio"
					step="0.01"
					class="block w-full pl-7 pr-12 py-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="0.00"
					value={form?.precio || data.producto.precio}
					required
				/>
			</div>
		</div>

		<div>
			<label for="existencia" class="block text-sm font-medium text-gray-700">Existencia</label>
			<div class="mt-1">
				<div
					id="existencia"
					class="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
				>
					{data.producto.existencia}
				</div>
				<p class="mt-1 text-xs text-gray-500">La existencia solo se puede modificar a través de los módulos de Ingresos y Salidas.</p>
			</div>
		</div>

		<div>
			<label for="stock_minimo" class="block text-sm font-medium text-gray-700">Stock Mínimo</label>
			<div class="mt-1">
				<input
					type="number"
					name="stock_minimo"
					id="stock_minimo"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="Ej: 10"
					value={form?.stock_minimo ?? data.producto.stock_minimo}
				/>
			</div>
		</div>

		<div>
			<label for="stock_maximo" class="block text-sm font-medium text-gray-700">Stock Máximo</label>
			<div class="mt-1">
				<input
					type="number"
					name="stock_maximo"
					id="stock_maximo"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					placeholder="Ej: 200"
					value={form?.stock_maximo ?? data.producto.stock_maximo}
				/>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<a href="/productos" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-3 hover:bg-gray-300 transition-colors">
				Cancelar
			</a>
			<button
				type="submit"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
					<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
					<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
				</svg>
				Actualizar Producto
			</button>
		</div>
		{#if form?.error}
			<p class="text-red-500 text-sm mt-2 text-center">{form.error}</p>
		{/if}
	</form>
</div>
