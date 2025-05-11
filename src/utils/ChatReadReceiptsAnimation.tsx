import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, View, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import READ_RECEIPT from '../assets/TextChatAssets/TickRead_Icon.png';
import DELIVERED_RECEIPT from '../assets/TextChatAssets/TickDelivered_Icon.png';
import SENT_RECEIPT from '../assets/TextChatAssets/TickSent_Icon.png';

type MessageStatus = 'sent' | 'delivered' | 'read';

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  style?: StyleProp<ViewStyle>;
}

const getStatusIcon = (status: MessageStatus): ImageSourcePropType => {
  switch (status) {
    case 'read':
      return READ_RECEIPT;
    case 'delivered':
      return DELIVERED_RECEIPT;
    default:
      return SENT_RECEIPT;
  }
};

const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({
  status,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIcon, setCurrentIcon] = useState<ImageSourcePropType>(getStatusIcon(status));

  useEffect(() => {
    // Change icon immediately
    setCurrentIcon(getStatusIcon(status));

    // Fade in the icon smoothly
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, status]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={currentIcon} style={styles.icon} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  icon: {
    width: 10,
    height: 10,
  },
});

export default MessageStatusIndicator;
