import type { Producto } from '@prisma/client';

export async function createProduct(productData: Omit<Producto, 'id' | 'existencia'>) {
    const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el producto.');
    }

    return response.json();
}

export async function updateProduct(id: number, productData: Partial<Omit<Producto, 'existencia'>>) {
    const response = await fetch(`/api/productos/${id}`, {
        method: 'PATCH', // Using PATCH for partial updates
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el producto.');
    }

    return response.json();
}
