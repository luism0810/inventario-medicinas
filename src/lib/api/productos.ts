import type { Producto } from '@prisma/client';

export interface ProductsResponse {
	productos: Producto[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export async function getProducts(page = 1, limit = 10, search = ''): Promise<ProductsResponse> {
	const params = new URLSearchParams({
		page: page.toString(),
		limit: limit.toString(),
		search: search
	});
	
	const response = await fetch(`/api/productos?${params}`);
	
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al obtener productos');
	}
	
	return response.json();
}

export async function getProduct(id: number): Promise<Producto> {
	const response = await fetch(`/api/productos/${id}`);
	
	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Producto no encontrado');
	}
	
	return response.json();
}

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
		throw new Error(error.error || 'Error al crear el producto');
	}

	return response.json();
}

export async function updateProduct(id: number, productData: Partial<Omit<Producto, 'existencia'>>) {
	const response = await fetch(`/api/productos/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(productData)
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al actualizar el producto');
	}

	return response.json();
}

export async function deleteProduct(id: number) {
	const response = await fetch(`/api/productos/${id}`, {
		method: 'DELETE'
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al eliminar producto');
	}

	return response.json();
}