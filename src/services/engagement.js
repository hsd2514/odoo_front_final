// engagement.js - Engagement APIs for promotions, loyalty, and notifications
import http from './http';

// Promotions
export async function getPromotions() {
  try {
    const { data } = await http.get('/engage/promotions');
    return Array.isArray(data) ? data : (data?.items || []);
  } catch (error) {
    console.error('Failed to fetch promotions:', error);
    return [];
  }
}

export async function applyPromotion(promotionCode, cartTotal) {
  try {
    const { data } = await http.post('/engage/promotions', {
      code: promotionCode,
      cart_total: cartTotal
    });
    return data;
  } catch (error) {
    console.error('Failed to apply promotion:', error);
    return null;
  }
}

// Loyalty
export async function createOrFetchLoyaltyAccount(userId) {
  try {
    const { data } = await http.post('/engage/loyalty', { user_id: userId });
    return data;
  } catch (error) {
    console.error('Failed to create/fetch loyalty account:', error);
    return null;
  }
}

export async function earnLoyaltyPoints(userId, points = 10) {
  try {
    const { data } = await http.post(`/engage/loyalty/${userId}/earn`, { points });
    return data;
  } catch (error) {
    console.error('Failed to earn loyalty points:', error);
    return null;
  }
}

// Notifications
export async function createNotification(userId, type, scheduledFor = null) {
  try {
    const { data } = await http.post('/utility/notifications', {
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
    const { data } = await http.post(`/utility/notifications/${notificationId}/mark_sent`);
    return data;
  } catch (error) {
    console.error('Failed to mark notification as sent:', error);
    return null;
  }
}
