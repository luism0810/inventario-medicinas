<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { Role } from '@prisma/client';

	export let form: ActionData;
</script>

<h2 class="text-2xl font-bold mb-4">Crear Nuevo Usuario</h2>

<form method="POST" action="?/create" use:enhance class="bg-white shadow-md rounded-lg p-6">
	<div class="mb-4">
		<label for="username" class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
		<input
			type="text"
			id="username"
			name="username"
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>

	<div class="mb-4">
		<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
		<input
			type="password"
			id="password"
			name="password"
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		/>
	</div>

	<div class="mb-4">
		<label for="role" class="block text-sm font-medium text-gray-700">Rol</label>
		<select
			id="role"
			name="role"
			required
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
		>
			{#each Object.values(Role) as roleOption}
				<option value={roleOption}>{roleOption}</option>
			{/each}
		</select>
	</div>

	<div class="mb-4 flex items-center">
		<input
			type="checkbox"
			id="active"
			name="active"
			checked
			class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
		/>
		<label for="active" class="ml-2 block text-sm text-gray-900">Activo</label>
	</div>

	{#if form?.message}
		<p class="text-sm text-red-600 mb-4">{form.message}</p>
	{/if}

	<div class="flex justify-end">
		<a
			href="/admin/users"
			class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			Cancelar
		</a>
		<button
			type="submit"
			class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			Crear Usuario
		</button>
	</div>
</form>
