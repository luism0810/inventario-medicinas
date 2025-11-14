<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h2 class="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

<div class="mb-4">
	<a
		href="/admin/users/new"
		class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		Crear Nuevo Usuario
	</a>
</div>

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				>
					Usuario
				</th>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				>
					Rol
				</th>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				>
					Activo
				</th>
				<th scope="col" class="relative px-6 py-3">
					<span class="sr-only">Acciones</span>
				</th>
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#each data.users as user}
				<tr>
					<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
						{user.username}
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{user.role}
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{user.active ? 'Sí' : 'No'}
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
						<a href="/admin/users/{user.id}/edit" class="text-indigo-600 hover:text-indigo-900 mr-4"
							>Editar</a
						>
						<!-- Add deactivate/delete button here -->
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
