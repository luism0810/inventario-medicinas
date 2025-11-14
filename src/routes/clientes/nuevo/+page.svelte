<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-2xl font-bold text-gray-800 flex items-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
		Agregar Nuevo Cliente
	</h1>
</div>

<div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
	<form method="POST" use:enhance class="space-y-6">
		<div>
			<label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
			<div class="mt-1">
				<input
					type="text"
					name="nombre"
					id="nombre"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.nombre || ''}
					required
				/>
			</div>
		</div>

        <div>
			<label for="codigo" class="block text-sm font-medium text-gray-700">Código</label>
			<div class="mt-1">
				<input
					type="text"
					name="codigo"
					id="codigo"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.codigo || ''}
					required
				/>
			</div>
		</div>

        <div>
			<label for="direccion" class="block text-sm font-medium text-gray-700">Dirección</label>
			<div class="mt-1">
				<input
					type="text"
					name="direccion"
					id="direccion"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.direccion || ''}
					required
				/>
			</div>
		</div>

        <div>
			<label for="responsable" class="block text-sm font-medium text-gray-700">Responsable</label>
			<div class="mt-1">
				<input
					type="text"
					name="responsable"
					id="responsable"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.responsable || ''}
					required
				/>
			</div>
		</div>

        <div>
			<label for="cedulaRif" class="block text-sm font-medium text-gray-700">Cédula/RIF</label>
			<div class="mt-1">
				<input
					type="text"
					name="cedulaRif"
					id="cedulaRif"
					class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={form?.cedulaRif || ''}
					required
				/>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<a href="/clientes" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-3 hover:bg-gray-300 transition-colors">
				Cancelar
			</a>
			<button
				type="submit"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
				</svg>
				Guardar Cliente
			</button>
		</div>
		{#if form?.error}
			<p class="text-red-500 text-sm mt-2 text-center">{form.error}</p>
		{/if}
	</form>
</div>
