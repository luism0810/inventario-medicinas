<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h1>

		<form method="POST" action="?/login" use:enhance>
			<div class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700">Usuario</label>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				{#if form?.message}
					<p class="text-sm text-center text-red-500">
						{form.message}
					</p>
				{/if}

				<div>
					<button
						type="submit"
						class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Entrar
					</button>
				</div>
			</div>
		</form>
		<div class="text-sm text-center">
			<a href="/reset-password" class="font-medium text-indigo-600 hover:text-indigo-500">
				¿Olvidó su contraseña?
			</a>
		</div>
	</div>
</div>
