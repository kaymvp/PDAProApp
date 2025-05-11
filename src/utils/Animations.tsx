import { Animated } from 'react-native';

// utils/animations.ts
export const fadeIn = (value: Animated.Value, duration = 300) =>
    Animated.timing(value, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });

  export const fadeOut = (value: Animated.Value, duration = 300) =>
    Animated.timing(value, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });


