// LaunchScreen.tsx
// -----------------------------------------------------------
// This screen thanks the user and prompts them to start a session
// or skip for now. It's likely shown right after onboarding.
// -----------------------------------------------------------
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const LaunchScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Thanks for sharing. Your profile is ready!
      </Text>

      <Text style={styles.description}>
        From here, we've designed a quick session where you can discuss with an
        expert who understands PDA.
      </Text>
      <Text style={styles.highlightText}>
        Based on what you've shared, we'll try to find a new practical solution
        to your current biggest issue.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.primaryButtonText}>Start Session</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14242F', // deep blue
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#08A2AF',
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 150,
    padding: 55,
  },
  description: {
    color: '#EFEBE0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 25,
  },
  highlightText: {
    color: '#048A96',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 55,
  },
  primaryButton: {
    backgroundColor: '#048A96',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#EFEBE0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#0C2C3B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    marginBottom: 50,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#EFEBE0',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LaunchScreen;
