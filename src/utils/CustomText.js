// CustomText.js
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

export const Text = ({ style, ...props }) => {
  return <RNText {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lato-Regular', // global text font
  },
});
