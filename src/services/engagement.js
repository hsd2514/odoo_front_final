// engagement.js - Engagement APIs for promotions, loyalty, and notifications
import http from './http';
import { ENGAGE_PROMOTIONS_PATH, LOYALTY_BASE_PATH, UTILITY_NOTIFICATIONS_PATH } from './endpoints';

// Promotions
export async function getPromotions() {
  try {
    const { data } = await http.get(ENGAGE_PROMOTIONS_PATH);
    return Array.isArray(data) ? data : (data?.items || []);
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    return [];
  }
}

export async function listPromotions() {
  const { data } = await http.get('/engage/promotions');
  return Array.isArray(data) ? data : (data?.items || []);
}

export async function createPromotion({ code, discount_type, discount_value, start_date, end_date, usage_limit }) {
  const payload = { code, discount_type, value: discount_value, start_date, end_date, usage_limit };
  const { data } = await http.post('/engage/promotions', payload);
  return data;
}

export async function applyPromotion(promotionCode, cartTotal) {
  try {
    const { data } = await http.post(`${ENGAGE_PROMOTIONS_PATH}/apply`, {
      code: promotionCode,
      cart_total: cartTotal
    });
    return data;
  } catch (error) {
    console.error('Failed to apply promotion:', error);
    return null;
  }
}

export async function setupTestPromotions() {
  try {
    const { data } = await http.post(`${ENGAGE_PROMOTIONS_PATH}/test-setup`);
    return data;
  } catch (error) {
    console.error('Failed to setup test promotions:', error);
    return null;
  }
}

// Loyalty
export async function createOrFetchLoyaltyAccount(userId) {
  try {
    const { data } = await http.post(LOYALTY_BASE_PATH, { user_id: userId });
    return data;
  } catch (error) {
    console.error('Failed to create/fetch loyalty account:', error);
    return null;
  }
}

export async function earnLoyaltyPoints(userId, points = 10) {
  try {
    const { data } = await http.post(`${LOYALTY_BASE_PATH}/${userId}/earn`, { points });
    return data;
  } catch (error) {
    console.error('Failed to earn loyalty points:', error);
    return null;
  }
}

// Notifications
export async function createNotification(userId, type, scheduledFor = null) {
  try {
    const { data } = await http.post(UTILITY_NOTIFICATIONS_PATH, {
      user_id: userId,
      type: type,
      scheduled_for: scheduledFor
    });
    return data;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

export async function markNotificationSent(notificationId) {
  try {
    const { data } = await http.post(`${UTILITY_NOTIFICATIONS_PATH}/${notificationId}/mark_sent`);
    return data;
  } catch (error) {
    console.error('Failed to mark notification as sent:', error);
    return null;
  }
}
