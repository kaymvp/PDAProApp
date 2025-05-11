// utils/animations.ts
// ----------------------------------------------------------------
// These utility functions create fade-in and fade-out animations
// using React Native's Animated API. They can be reused across
// components for consistent animation effects.
// ----------------------------------------------------------------

import { Animated } from 'react-native';

/**
 * fadeIn
 * Creates a fade-in animation by transitioning the opacity
 * of an Animated.Value from 0 to 1 over a specified duration.
 * 
 * @param value - Animated.Value representing opacity (e.g., new Animated.Value(0))
 * @param duration - Duration in milliseconds (default: 300ms)
 */
export const fadeIn = (value: Animated.Value, duration = 300) => {
  console.log('[fadeIn] Starting fade-in animation...');
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true, // Enables GPU acceleration for smoother performance
  });
};

/**
 * fadeOut
 * Creates a fade-out animation by transitioning the opacity
 * of an Animated.Value from 1 to 0 over a specified duration.
 * 
 * @param value - Animated.Value representing opacity (e.g., new Animated.Value(1))
 * @param duration - Duration in milliseconds (default: 300ms)
 */
export const fadeOut = (value: Animated.Value, duration = 300) => {
  console.log('[fadeOut] Starting fade-out animation...');
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};
