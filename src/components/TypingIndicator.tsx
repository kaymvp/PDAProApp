import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface TypingIndicatorProps {
  dotAnimation: Animated.Value;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ dotAnimation }) => {
  const dot1Opacity = dotAnimation.interpolate({
    inputRange: [0, 1, 1.1, 3],
    outputRange: [0.3, 1, 1, 0.3],
    extrapolate: 'clamp',
  });

  const dot2Opacity = dotAnimation.interpolate({
    inputRange: [0, 1, 2, 2.1, 3],
    outputRange: [0.3, 0.3, 1, 1, 0.3],
    extrapolate: 'clamp',
  });

  const dot3Opacity = dotAnimation.interpolate({
    inputRange: [0, 2, 3, 3.1],
    outputRange: [0.3, 0.3, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.dotsContainer}>
      <Animated.View style={[styles.dot1, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.dot2, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.dot3, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5C04',
    marginHorizontal: 4,
  },
  dot2: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#048A96',
    marginHorizontal: 4,
  },
  dot3: {
    width: 8,
    height: 8,
    borderRadius: 4, 
    backgroundColor: '#08A2AF',
    marginHorizontal: 4,
  },

});

export default TypingIndicator;
