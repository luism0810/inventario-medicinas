<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	function formatDateTime(date: Date) {
		return new Intl.DateTimeFormat('es-VE', {
			dateStyle: 'long',
			timeStyle: 'short'
		}).format(date);
	}
</script>

<h2 class="text-2xl font-bold mb-4">Registro de Auditoría</h2>

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				>
					Fecha y Hora
				</th>
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
					Acción
				</th>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
				>
					Detalles
				</th>
			</tr>
		</thead>
		<tbody class="bg-white divide-y divide-gray-200">
			{#each data.auditLogs as log}
				<tr>
					<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
						{formatDateTime(log.timestamp)}
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{log.user.username}
					</td>
					<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
						{log.action}
					</td>
					<td class="px-6 py-4 text-sm text-gray-500">
						{log.details}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
