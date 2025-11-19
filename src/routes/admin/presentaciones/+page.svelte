<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';

  export let data: PageData;
  export let form: ActionData;

  let showEditModal = false;
  let editingPresentacion: { id: number; nombre: string } | null = null;
  let EditPresentacionForm: any;

  import { onMount } from 'svelte';

  onMount(async () => {
    EditPresentacionForm = (await import('./[id]/edit/+page.svelte')).default;
  });

  function openEditModal(presentacion: { id: number; nombre: string }) {
    editingPresentacion = { ...presentacion };
    showEditModal = true;
  }

  function closeEditModal() {
    showEditModal = false;
    editingPresentacion = null;
    goto('/admin/presentaciones', { replaceState: true, invalidateAll: true });
  }

  function onSavedEdit() {
    closeEditModal();
  }
</script>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-2xl font-bold text-gray-800">Gestión de Presentaciones</h1>
  <form method="POST" action="?/create" use:enhance class="flex items-center space-x-3">
    <input
      type="text"
      name="nombre"
      placeholder="Nueva Presentación"
      class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      value={form?.nombre || ''}
      required
    />
    <button
      type="submit"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Añadir
    </button>
  </form>
</div>

{#if form?.error}
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
    <strong class="font-bold">Error:</strong>
    <span class="block sm:inline">{form.error}</span>
  </div>
{/if}

{#if data.presentaciones.length}
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each data.presentaciones as presentacion}
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{presentacion.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{presentacion.nombre}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-3">
                <button type="button" class="text-indigo-600 hover:text-indigo-900" title="Editar" on:click={() => openEditModal(presentacion)}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                  </svg>
                </button>
                <form method="POST" action="?/delete" use:enhance class="inline-block">
                  <input type="hidden" name="id" value={presentacion.id} />
                  <button type="submit" class="text-red-600 hover:text-red-900" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <p class="text-center text-gray-500 mt-8">No hay presentaciones registradas.</p>
{/if}

{#if showEditModal && editingPresentacion}
  <svelte:component this={EditPresentacionForm} presentacion={editingPresentacion} on:close={closeEditModal} on:saved={onSavedEdit} />
{/if}
