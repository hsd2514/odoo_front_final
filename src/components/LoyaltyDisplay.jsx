// LoyaltyDisplay.jsx
// Component to display and manage user loyalty points

import React, { useState, useEffect } from 'react';
import { createOrFetchLoyaltyAccount, earnLoyaltyPoints } from '../services/engagement';
import { pricingColors, textColors } from '../utils/colors';

const LoyaltyDisplay = ({ userId, className = '' }) => {
  const [loyaltyAccount, setLoyaltyAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      loadLoyaltyAccount();
    }
  }, [userId]);

  const loadLoyaltyAccount = async () => {
    try {
      setLoading(true);
      const account = await createOrFetchLoyaltyAccount(userId);
      if (account) {
        setLoyaltyAccount(account);
      }
    } catch (error) {
      console.error('Failed to load loyalty account:', error);
      setError('Failed to load loyalty information');
    } finally {
      setLoading(false);
    }
  };

  const handleEarnPoints = async () => {
    if (!userId || !loyaltyAccount) return;

    try {
      setLoading(true);
      const result = await earnLoyaltyPoints(userId, 10);
      if (result) {
        setLoyaltyAccount(prev => ({
          ...prev,
          points: (prev.points || 0) + 10
        }));
      }
    } catch (error) {
      console.error('Failed to earn points:', error);
      setError('Failed to earn loyalty points');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-900">Loyalty Rewards</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm">★</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="text-blue-600 text-sm">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <div className="text-red-600 text-sm mb-2">{error}</div>
          <button 
            onClick={loadLoyaltyAccount}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      ) : loyaltyAccount ? (
        <div className="space-y-3">
          {/* Points Display */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {loyaltyAccount.points || 0}
            </div>
            <div className="text-xs text-blue-600">Loyalty Points</div>
          </div>

          {/* Points Info */}
          <div className="text-xs text-blue-700 space-y-1">
            <div>• Earn 10 points per purchase</div>
            <div>• 100 points = ₹10 discount</div>
            <div>• Points never expire</div>
          </div>

          {/* Earn Points Button */}
          <button
            onClick={handleEarnPoints}
            disabled={loading}
            className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
            style={{ 
              backgroundColor: pricingColors.primary,
              color: textColors.primary
            }}
          >
            {loading ? 'Processing...' : 'Earn 10 Points'}
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-blue-600 text-sm">No loyalty account found</div>
          <button 
            onClick={loadLoyaltyAccount}
            className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDisplay;
