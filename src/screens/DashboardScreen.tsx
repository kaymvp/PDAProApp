import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';


const BACK_ICON = require('../assets/TextChatAssets/Arrow-Left.png');


const DashboardScreen = () => {
  const { navigate, goBack } = useNavigation();

  const unreadMessages = 2;

  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <TouchableOpacity onPress={goBack} style={styles.backIconWrapper}>
        <Image source={BACK_ICON} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Text style={styles.header}>Mornings ARE hard!</Text>
        <Text style={styles.subheader}>
          42% of parents are reporting that they also find mornings the most challenging part of the day.
        </Text>

        {/* Read More */}
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>

            {/* Chat to Gale */}
             <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.featureCard, styles.largeCard]}
            onPress={() => navigate('Chat', { userId: 'user123', childId: 'child456' })}
          >
            <View style={styles.iconRow}>
              {unreadMessages > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadMessages}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardTitle}>Chat to Gale</Text>
            <Text style={styles.cardDesc}>Get support and guidance from your PDA expert</Text>
          </TouchableOpacity>

          {/* Translator */}
          <View style={[styles.featureCard, styles.translatorCard, styles.largeCard]}>
            <Text style={styles.cardTitle}>Translator</Text>
            <Text style={styles.cardDesc}>Turn requests into non-demand language</Text>
          </View>
        </View>

        {/* Venting Space */}
        <Text style={styles.featureTitle}>Vote on the Next Feature!</Text>
        <View style={styles.ventingCard}>
          <Text style={styles.ventingTitle}>Venting Space</Text>
          <Text style={styles.ventingcardDesc}>Share freely, receive empathy.   
            No judgment – just support.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C2C3B',
    paddingTop: 40,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backIconWrapper: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  featureTitle:{
    fontSize: 18,
    color: '#08A2AF',
    right:70,
    top: 60,
  },

  chatCard:{
    backgroundColor: '#FFBO3O',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 1,
    alignItems: 'center',
    position: 'relative',
  },
  ventingCard:{
    backgroundColor: '#14242F',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 70,
    alignItems: 'center',
    position: 'relative',
  },
  ventingTitle:{
    fontSize: 22,
    fontWeight: '700',
    color: '#EFEBE0',
    marginTop: 2,
    right:100,
  },
  ventingcardDesc:{
    fontSize: 14,
    color: '#EFEBE0',
    textAlign: 'center',
    marginTop: 5,
    right:70,
    paddingHorizontal: 60,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  largeCard: {
    width: '48%',
    height: 290,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    color: '#EFEBE0',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 14,
    color: '#D8D2C2',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  readMoreButton: {
    backgroundColor: '#08A2AF',
    paddingVertical: 10,
    paddingHorizontal: 135,
    borderRadius: 25,
    marginBottom: 60,
  },
  readMoreText: {
    color: '#EFEBE0',
    fontWeight: '600',
    fontSize: 16,
  },
  featureCard: {
    backgroundColor: '#FFB030',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
    position: 'relative',
  },
  translatorCard: {
    backgroundColor: '#FF5C04',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EFEBE0',
    marginTop: 10,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: '#EFEBE0',
    textAlign: 'center',
    marginTop: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  iconRow: {
    position: 'relative',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -116,
    right:-95,
    backgroundColor: '#EFEBE0',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FF5C04',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
