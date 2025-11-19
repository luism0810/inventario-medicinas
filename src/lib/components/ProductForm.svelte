<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createProduct as apiCreate, updateProduct as apiUpdate } from '$lib/api/productos'; // ajusta ruta si es necesario

  export let editing: any = null;

  const dispatch = createEventDispatcher();
  let local: any = { name: '', code: '', price: 0, stock: 0, presentacion: '' }; // Added presentacion
  let errorMessage: string | null = null; // To display error messages

  onMount(() => {
    if (editing) {
      local = { ...editing };
    } else {
      local = { nombre: '', codigo: '', precio: 0, existencia: 0, presentacion: '', stock_minimo: 0, stock_maximo: 0 };
    }
  });

  function close() {
    dispatch('close');
  }

  async function save() {
    errorMessage = null; // Clear previous errors

    // Client-side validation for stock_minimo and stock_maximo
    if (local.stock_minimo > local.stock_maximo) {
      errorMessage = 'El stock mínimo no puede ser mayor que el stock máximo.';
      return; // Prevent form submission
    }

    try {
      if (editing && editing.id != null) {
        await apiUpdate(editing.id, local);
      } else {
        await apiCreate(local);
      }
      dispatch('saved');
    } catch (e: any) {
      errorMessage = e.body?.message || e.message || 'Ocurrió un error al guardar el producto.';
      dispatch('error', { error: errorMessage });
    }
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
  <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
    <h3 class="text-2xl font-bold mb-4 text-gray-800">{editing ? 'Editar producto' : 'Crear producto'}</h3>

    {#if errorMessage}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline">{errorMessage}</span>
      </div>
    {/if}

    <div class="space-y-4">
      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Nombre</span>
        <input type="text" bind:value={local.nombre} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Código</span>
        <input type="text" bind:value={local.codigo} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Presentación</span>
        <input type="text" bind:value={local.presentacion} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Precio</span>
        <input type="number" bind:value={local.precio} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Existencia</span>
        <input type="number" bind:value={local.existencia} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" disabled />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Stock Mínimo</span>
        <input type="number" bind:value={local.stock_minimo} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </label>

      <label class="block">
        <span class="text-gray-700 text-sm font-medium">Stock Máximo</span>
        <input type="number" bind:value={local.stock_maximo} class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </label>
    </div>

    <div class="mt-6 flex justify-end space-x-3">
      <button type="button" on:click={close} class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Cerrar
      </button>
      <button type="button" on:click={save} class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Guardar
      </button>
    </div>
  </div>
</div>