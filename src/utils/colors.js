// colors.js - Color palette utilities for consistent theming

// Card Pricing Palette
export const pricingColors = {
  // Primary pricing color (your specified yellow)
  primary: '#F9DE66',
  
  // Secondary pricing colors
  secondary: '#FFB74D',      // Orange for discounts/sales
  accent: '#4CAF50',         // Green for savings/success
  highlight: '#FF5722',      // Red-orange for urgency/limited time
  
  // Neutral pricing colors
  neutral: '#9E9E9E',        // Gray for original prices
  muted: '#BDBDBD',          // Light gray for secondary text
  dark: '#424242',           // Dark gray for emphasis
};

// Card Background Palette
export const cardColors = {
  // Primary card backgrounds
  primary: '#FFFFFF',        // Pure white
  secondary: '#FAFBFC',      // Off-white (navbar background)
  tertiary: '#F5F6F7',      // Light gray (hover states)
  
  // Accent backgrounds
  accent: '#F0F8FF',        // Light blue tint
  success: '#F1F8E9',       // Light green tint
  warning: '#FFF8E1',       // Light yellow tint
  error: '#FFEBEE',         // Light red tint
};

// Border Colors
export const borderColors = {
  primary: '#E0E0E0',       // Standard borders
  secondary: '#BDBDBD',      // Secondary borders
  accent: '#F9DE66',        // Your yellow for highlights
  focus: '#2196F3',         // Blue for focus states
  error: '#F44336',         // Red for errors
  success: '#4CAF50',       // Green for success
};

// Text Colors
export const textColors = {
  primary: '#212121',       // Main text
  secondary: '#757575',     // Secondary text
  muted: '#9E9E9E',        // Muted text
  accent: '#F9DE66',        // Your yellow for highlights
  success: '#4CAF50',       // Success text
  error: '#F44336',         // Error text
  white: '#FFFFFF',         // White text
};

// Shadow Colors
export const shadowColors = {
  light: 'rgba(0, 0, 0, 0.04)',
  medium: 'rgba(0, 0, 0, 0.08)',
  heavy: 'rgba(0, 0, 0, 0.16)',
  colored: 'rgba(249, 222, 102, 0.2)', // Your yellow with opacity
};

// Utility function to get pricing color based on type
export const getPricingColor = (type = 'primary') => {
  switch (type) {
    case 'discount':
      return pricingColors.secondary;
    case 'savings':
      return pricingColors.accent;
    case 'urgent':
      return pricingColors.highlight;
    case 'original':
      return pricingColors.neutral;
    case 'primary':
    default:
      return pricingColors.primary;
  }
};

// Utility function to get card background based on state
export const getCardBackground = (state = 'default') => {
  switch (state) {
    case 'hover':
      return cardColors.tertiary;
    case 'selected':
      return cardColors.accent;
    case 'success':
      return cardColors.success;
    case 'warning':
      return cardColors.warning;
    case 'error':
      return cardColors.error;
    case 'default':
    default:
      return cardColors.primary;
  }
};
