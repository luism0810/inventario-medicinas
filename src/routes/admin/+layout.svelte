<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="w-64 bg-gray-800 text-white p-4">
		<h2 class="text-2xl font-bold mb-6">Admin Panel</h2>
		<nav>
			<ul>
				<li class="mb-2">
					<a href="/admin/users" class="block hover:bg-gray-700 px-3 py-2 rounded-md">Usuarios</a>
				</li>
				<li class="mb-2">
					<a href="/admin/audit-log" class="block hover:bg-gray-700 px-3 py-2 rounded-md">Registro de Auditoría</a>
				</li>
				<li class="mb-2">
					<a href="/admin/presentaciones" class="block hover:bg-gray-700 px-3 py-2 rounded-md">Presentaciones</a>
				</li>
				<!-- Add more admin links here -->
			</ul>
		</nav>
	</aside>

	<!-- Main content -->
	<main class="flex-1 p-6 overflow-y-auto">
		<h1 class="text-3xl font-bold mb-6">Bienvenido, {data.user.username}</h1>
		<slot />
	</main>
</div>
