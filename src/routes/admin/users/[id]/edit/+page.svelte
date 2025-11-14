<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { Role } from '@prisma/client';

	export let data: PageData;
	export let form: ActionData;

	let showPasswordChange = false;
</script>

<h2 class="text-2xl font-bold mb-4">Editar Usuario: {data.user.username}</h2>

{#if form?.success}
	<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
		<span class="block sm:inline">{form.message}</span>
	</div>
{/if}

{#if form?.message && !form?.success}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
		<span class="block sm:inline">{form.message}</span>
	</div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<!-- Edit User Details Form -->
	<div class="bg-white shadow-md rounded-lg p-6">
		<h3 class="text-xl font-semibold mb-4">Detalles del Usuario</h3>
		<form method="POST" action="?/update" use:enhance>
			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-700"
					>Nombre de Usuario</label
				>
				<input
					type="text"
					id="username"
					name="username"
					required
					value={data.user.username}
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
						<option value={roleOption} selected={data.user.role === roleOption}>{roleOption}</option>
					{/each}
				</select>
			</div>

			<div class="mb-4 flex items-center">
				<input
					type="checkbox"
					id="active"
					name="active"
					checked={data.user.active}
					class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
				/>
				<label for="active" class="ml-2 block text-sm text-gray-900">Activo</label>
			</div>

			<div class="flex justify-end">
				<button
					type="submit"
					class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					Actualizar Usuario
				</button>
			</div>
		</form>
	</div>

	<!-- Change Password Form -->
	<div class="bg-white shadow-md rounded-lg p-6">
		<h3 class="text-xl font-semibold mb-4">Cambiar Contraseña</h3>
		<button
			on:click={() => (showPasswordChange = !showPasswordChange)}
			class="mb-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			{showPasswordChange ? 'Ocultar' : 'Mostrar'} Formulario de Contraseña
		</button>

		{#if showPasswordChange}
			<form method="POST" action="?/changePassword" use:enhance class="mt-4">
				<div class="mb-4">
					<label for="newPassword" class="block text-sm font-medium text-gray-700"
						>Nueva Contraseña</label
					>
					<input
						type="password"
						id="newPassword"
						name="newPassword"
						required
						class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					/>
				</div>
				<div class="flex justify-end">
					<button
						type="submit"
						class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Cambiar Contraseña
					</button>
				</div>
			</form>
		{/if}

		<!-- Delete User Button -->
		<h3 class="text-xl font-semibold mt-8 mb-4">Eliminar Usuario</h3>
		<form method="POST" action="?/delete" use:enhance>
			<button
				type="submit"
				class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
				on:click|preventDefault={() => {
					if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
						// @ts-ignore
						this.form.submit();
					}
				}}
			>
				Eliminar Usuario
			</button>
		</form>
	</div>
</div>
