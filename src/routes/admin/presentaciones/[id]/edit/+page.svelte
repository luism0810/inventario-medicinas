<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import { createEventDispatcher } from 'svelte';

  export let data: PageData;
  export let form: ActionData;
  export let presentacion: { id: number; nombre: string }; // Prop passed from parent

  const dispatch = createEventDispatcher();

  let nombre = presentacion.nombre; // Initialize with current presentation name

  async function handleSubmit() {
    const response = await fetch(`/api/presentaciones/${presentacion.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre })
    });

    if (response.ok) {
      dispatch('saved');
    } else {
      const errorData = await response.json();
      console.error('Error al actualizar:', errorData.error);
      // Handle error display
    }
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
  <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">Editar Presentación</h3>

    {#if form?.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{form.error}</span>
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Nombre de la Presentación</span>
        <input
          type="text"
          bind:value={nombre}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </label>

      <div class="mt-6 flex justify-end space-x-3">
        <button type="button" on:click={() => dispatch('close')} class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancelar
        </button>
        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Guardar Cambios
        </button>
      </div>
    </form>
  </div>
</div>
