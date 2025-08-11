// admin.js - Admin-only APIs for role management, catalog, inventory, and rentals
import http from './http';

// Role Management (Admin only)
export async function getRoles() {
  try {
    const { data } = await http.get('/roles');
    return Array.isArray(data) ? data : (data?.items || []);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    throw error;
  }
}

export async function createRole(roleData) {
  try {
    const { data } = await http.post('/roles', roleData);
    return data;
  } catch (error) {
    console.error('Failed to create role:', error);
    throw error;
  }
}

export async function assignRole(userId, roleId) {
  try {
    const { data } = await http.post('/roles/assign', { user_id: userId, role_id: roleId });
    return data;
  } catch (error) {
    console.error('Failed to assign role:', error);
    throw error;
  }
}

// Catalog Management (Admin/Seller)
export async function createCategory(categoryData) {
  try {
    const { data } = await http.post('/catalog/categories', categoryData);
    return data;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

export async function updateCategory(categoryId, categoryData) {
  try {
    const { data } = await http.patch(`/catalog/categories/${categoryId}`, categoryData);
    return data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await http.delete(`/catalog/categories/${categoryId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const { data } = await http.post('/catalog/products', productData);
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    const { data } = await http.patch(`/catalog/products/${productId}`, productData);
    return data;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const { data } = await http.delete(`/catalog/products/${productId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

export async function uploadProductAsset(productId, assetData) {
  try {
    const { data } = await http.post(`/catalog/products/${productId}/assets`, assetData);
    return data;
  } catch (error) {
    console.error('Failed to upload product asset:', error);
    throw error;
  }
}

export async function deleteProductAsset(productId, assetId) {
  try {
    const { data } = await http.delete(`/catalog/products/${productId}/assets/${assetId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete product asset:', error);
    throw error;
  }
}

// Inventory Management (Admin/Seller)
export async function createInventoryItem(itemData) {
  try {
    const { data } = await http.post('/inventory/items', itemData);
    return data;
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(itemId, itemData) {
  try {
    const { data } = await http.patch(`/inventory/items/${itemId}`, itemData);
    return data;
  } catch (error) {
    console.error('Failed to update inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId) {
  try {
    const { data } = await http.delete(`/inventory/items/${itemId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete inventory item:', error);
    throw error;
  }
}

export async function updateInventoryStatus(itemId, status) {
  try {
    const { data } = await http.patch(`/inventory/items/${itemId}/status`, { status });
    return data;
  } catch (error) {
    console.error('Failed to update inventory status:', error);
    throw error;
  }
}

// Rental Operations (Admin/Seller)
export async function createSchedule(scheduleData) {
  try {
    const { data } = await http.post('/schedules', scheduleData);
    return data;
  } catch (error) {
    console.error('Failed to create schedule:', error);
    throw error;
  }
}

export async function updateSchedule(scheduleId, scheduleData) {
  try {
    const { data } = await http.patch(`/schedules/${scheduleId}`, scheduleData);
    return data;
  } catch (error) {
    console.error('Failed to update schedule:', error);
    throw error;
  }
}

export async function createHandoverQR(handoverData) {
  try {
    const { data } = await http.post('/handover_qr', handoverData);
    return data;
  } catch (error) {
    console.error('Failed to create handover QR:', error);
    throw error;
  }
}

export async function verifyHandoverQR(qrData) {
  try {
    const { data } = await http.post('/handover_qr/verify', qrData);
    return data;
  } catch (error) {
    console.error('Failed to verify handover QR:', error);
    throw error;
  }
}
