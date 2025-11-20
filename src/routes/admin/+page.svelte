<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg">
	<div class="px-4 py-5 sm:px-6">
		<h3 class="text-lg leading-6 font-medium text-gray-900">Panel de Administración</h3>
		<p class="mt-1 max-w-2xl text-sm text-gray-500">Gestión de usuarios y auditoría del sistema.</p>
	</div>
	<div class="border-t border-gray-200 px-4 py-5 sm:p-6">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Card Usuarios -->
			<a
				href="/admin/users"
				class="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
						<svg
							class="h-6 w-6 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h4 class="text-lg font-medium text-gray-900">Usuarios</h4>
						<p class="mt-1 text-sm text-gray-500">Gestionar usuarios y roles.</p>
					</div>
				</div>
			</a>

			<!-- Card Audit Log -->
			<a
				href="/admin/audit-log"
				class="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
						<svg
							class="h-6 w-6 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h4 class="text-lg font-medium text-gray-900">Audit Log</h4>
						<p class="mt-1 text-sm text-gray-500">Ver registro de actividades.</p>
					</div>
				</div>
			</a>

			<!-- Card Presentaciones -->
			<a
				href="/admin/presentaciones"
				class="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
			>
				<div class="flex items-center">
					<div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
						<svg
							class="h-6 w-6 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
							/>
						</svg>
					</div>
					<div class="ml-4">
						<h4 class="text-lg font-medium text-gray-900">Presentaciones</h4>
						<p class="mt-1 text-sm text-gray-500">Gestionar tipos de envase.</p>
					</div>
				</div>
			</a>
		</div>
	</div>
</div>
