// admin.js - Admin-only APIs for role management, catalog, inventory, and rentals
import http from './http';
import { ROLES_PATH, ROLES_ASSIGN_PATH, CATEGORIES_PATH, PRODUCTS_PATH, INVENTORY_ITEMS_PATH, SCHEDULES_PATH, HANDOVER_QR_PATH } from './endpoints';

// Role Management (Admin only)
export async function getRoles() {
  try {
    const { data } = await http.get(ROLES_PATH);
    return Array.isArray(data) ? data : (data?.items || []);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    throw error;
  }
}

export async function createRole(roleData) {
  try {
    const { data } = await http.post(ROLES_PATH, roleData);
    return data;
  } catch (error) {
    console.error('Failed to create role:', error);
    throw error;
  }
}

export async function assignRole(userId, roleId) {
  try {
    const { data } = await http.post(ROLES_ASSIGN_PATH, { user_id: userId, role_id: roleId });
    return data;
  } catch (error) {
    console.error('Failed to assign role:', error);
    throw error;
  }
}

// Catalog Management (Admin/Seller)
export async function createCategory(categoryData) {
  try {
    const { data } = await http.post(CATEGORIES_PATH, categoryData);
    return data;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

export async function updateCategory(categoryId, categoryData) {
  try {
    const { data } = await http.patch(`${CATEGORIES_PATH}/${categoryId}`, categoryData);
    return data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await http.delete(`${CATEGORIES_PATH}/${categoryId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}

export async function createProduct(productData) {
  try {
    const { data } = await http.post(PRODUCTS_PATH, productData);
    return data;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  try {
    const { data } = await http.patch(`${PRODUCTS_PATH}/${productId}`, productData);
    return data;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const { data } = await http.delete(`${PRODUCTS_PATH}/${productId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

export async function uploadProductAsset(productId, assetData) {
  try {
    const { data } = await http.post(`${PRODUCTS_PATH}/${productId}/assets`, assetData);
    return data;
  } catch (error) {
    console.error('Failed to upload product asset:', error);
    throw error;
  }
}

export async function uploadProductAssetFile(productId, file) {
  try {
    const form = new FormData();
    form.append('file', file);
    const { data } = await http.post(`${PRODUCTS_PATH}/${productId}/assets/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    console.error('Failed to upload product asset file:', error);
    throw error;
  }
}

export async function deleteProductAsset(productId, assetId) {
  try {
    const { data } = await http.delete(`${PRODUCTS_PATH}/${productId}/assets/${assetId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete product asset:', error);
    throw error;
  }
}

// Inventory Management (Admin/Seller)
export async function listInventoryItems(params = {}) {
  const { product_id, status, page, limit } = params;
  const { data } = await http.get(INVENTORY_ITEMS_PATH, { params: { product_id, status, page, limit } });
  return Array.isArray(data) ? data : (data?.items || []);
}
export async function createInventoryItem(itemData) {
  try {
    const { data } = await http.post(INVENTORY_ITEMS_PATH, itemData);
    return data;
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(itemId, itemData) {
  try {
    const { data } = await http.patch(`${INVENTORY_ITEMS_PATH}/${itemId}`, itemData);
    return data;
  } catch (error) {
    console.error('Failed to update inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(itemId) {
  try {
    const { data } = await http.delete(`${INVENTORY_ITEMS_PATH}/${itemId}`);
    return data;
  } catch (error) {
    console.error('Failed to delete inventory item:', error);
    throw error;
  }
}

export async function updateInventoryStatus(itemId, status) {
  try {
    const { data } = await http.patch(`${INVENTORY_ITEMS_PATH}/${itemId}/status`, { status });
    return data;
  } catch (error) {
    console.error('Failed to update inventory status:', error);
    throw error;
  }
}

// Rental Operations (Admin/Seller)
export async function createSchedule(scheduleData) {
  try {
    const { data } = await http.post(SCHEDULES_PATH, scheduleData);
    return data;
  } catch (error) {
    console.error('Failed to create schedule:', error);
    throw error;
  }
}

export async function updateSchedule(scheduleId, scheduleData) {
  try {
    const { data } = await http.patch(`${SCHEDULES_PATH}/${scheduleId}`, scheduleData);
    return data;
  } catch (error) {
    console.error('Failed to update schedule:', error);
    throw error;
  }
}

export async function createHandoverQR(handoverData) {
  try {
    const { data } = await http.post(HANDOVER_QR_PATH, handoverData);
    return data;
  } catch (error) {
    console.error('Failed to create handover QR:', error);
    throw error;
  }
}

export async function verifyHandoverQR(qrData) {
  try {
    const { data } = await http.post(`${HANDOVER_QR_PATH}/verify`, qrData);
    return data;
  } catch (error) {
    console.error('Failed to verify handover QR:', error);
    throw error;
  }
}
