import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TypingIndicator from '../components/TypingIndicator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../utils/Navigation';
import PROFILE_IMAGE from '../assets/TextChatAssets/Chat-Female_Icon_Img.png';
import BACK_ICON from '../assets/TextChatAssets/Arrow-Left.png';
import SEND_ICON from '../assets/TextChatAssets/Icons-Send.png';
import ONLINE_ICON from '../assets/TextChatAssets/Online-Gale-Symbol.png';
import OFFLINE_ICON from '../assets/TextChatAssets/Offline-Gale.png';
import MessageStatusIndicator from '../utils/ChatReadReceiptsAnimation';
import {Text} from '../utils/CustomText';
import SoundPlayer from 'react-native-sound-player';
import {Message} from '../utils/MessageInterfaces';

const predefinedMessages = [
  "Hello there I'm Gale, your PDA expert. How are you feeling today?",
  "I'm here to support you with any questions or concerns you might have about your child.",
];
const reflectionPrompts = [
  'If you could change one thing about the way this week went, what would it be?',
  "What support do you feel you're missing right now?",
  'When was the last time you felt really confident in your parenting decisions?',
  'What would an ideal outcome look like for you in this situation?',
  'How are *you* holding up — outside of parenting duties?',
];
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const {userId, childId} = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [firstSession, setIsFirstSession] = useState(true);
  const [isGaleOnline, setIsGaleOnline] = useState(false);
  const [isGaleTyping, setIsGaleTyping] = useState(false);
  const dotAnimation = useRef(new Animated.Value(0)).current;
  const [threadId, setThreadId] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastSessionCode, setLastSessionCode] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  // Show predefined messages for first session
  const showPredefinedMessages = useCallback(async () => {
    const newMessages: Message[] = predefinedMessages.map((text, i) => ({
      id: Date.now() + i,
      sender: 'Gale',
      text,
      time: getCurrentTime(),
      isUser: false,
      status: 'read',
    }));

    setMessages(prev => [...prev, ...newMessages]);

    // Save in background without waiting
    AsyncStorage.setItem(
      `chatMessages_${userId}_${childId}`,
      JSON.stringify(newMessages),
    );
  }, [userId, childId]);
  useEffect(() => {
    let mounted = true;

    const loadChatData = async () => {
      try {
        // Immediately show empty chat UI
        if (mounted) {
          setIsLoading(false);
        }

        // Load data in background
        const keys = [
          `chatMessages_${userId}_${childId}`,
          `isFirstSession_${userId}_${childId}`,
          `threadId_${userId}_${childId}`,
          `lastSessionCode_${userId}_${childId}`,
        ];

        const [messages, firstSession, threadId, lastCode] =
          await AsyncStorage.multiGet(keys);

        if (mounted) {
          if (messages[1]) {
            setMessages(JSON.parse(messages[1]));
          }

          const isFirst = firstSession[1] !== 'false';
          setIsFirstSession(isFirst);

          if (threadId[1]) {
            setThreadId(threadId[1]);
          } else {
            const newThreadId = `thread_${Date.now()}`;
            setThreadId(newThreadId);
            AsyncStorage.setItem(keys[2], newThreadId); // No await for faster UI
          }

          if (lastCode[1]) {
            setLastSessionCode(lastCode[1]);
          }

          if (
            isFirst &&
            (!messages[1] || JSON.parse(messages[1]).length === 0)
          ) {
            showPredefinedMessages();
            AsyncStorage.setItem(keys[1], 'false'); // No await
          }
        }
      } catch (error) {
        console.error('Error loading chat:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadChatData();
    return () => {
      mounted = false;
    };
  }, [userId, childId, showPredefinedMessages]);

  // Keyboard visibility handlers
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        scrollToBottom();
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Typing animation
  useEffect(() => {
    if (isGaleTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 2,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      dotAnimation.stopAnimation();
      dotAnimation.setValue(0);
    }

    return () => {
      dotAnimation.stopAnimation();
    };
  }, [dotAnimation, isGaleTyping]);

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const updateMessageStatus = (
    messageId: number,
    newStatus: 'delivered' | 'read',
  ) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? {...msg, status: newStatus} : msg,
      ),
    );
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      return;
    }

    try {
      // Play send sound
      SoundPlayer.playAsset(
        require('../assets/TextChatSFX/SendMessage_SFX.mp3'),
      );
    } catch (e) {
      console.log('Cannot play sound file', e);
    }

    // Create user message
    const userMessage: Message = {
      id: Date.now(),
      sender: 'You',
      text: inputMessage.trim(),
      time: getCurrentTime(),
      isUser: true,
      status: 'sent',
    };

    // Update messages and clear input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');

    // Save messages to storage
    await AsyncStorage.setItem(
      `chatMessages_${userId}_${childId}`,
      JSON.stringify(updatedMessages),
    );

    // Update message status after delays
    setTimeout(() => {
      updateMessageStatus(userMessage.id, 'delivered');
    }, 1000);

    setTimeout(() => {
      updateMessageStatus(userMessage.id, 'read');
    }, 3000);

    // Set Gale to online and get response
    setIsGaleOnline(true);
    scrollToBottom();

    try {
      const response = await simulateApiCall(inputMessage);

      if (response) {
        await new Promise(resolve => setTimeout(resolve, 4000));
        setIsGaleTyping(true);
        // Split response into sentences
        const sentences = response.responseText
          .split('.')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        // Add Gale's responses one by one
        let currentMessages = [...updatedMessages];
        for (let i = 0; i < sentences.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1500));

          const galeMessage: Message = {
            id: Date.now() + i + 1000,
            sender: 'Gale',
            text: sentences[i] + (i < sentences.length - 1 ? '.' : ''),
            time: getCurrentTime(),
            isUser: false,
            status: 'read',
          };

          currentMessages = [...currentMessages, galeMessage];
          setMessages(currentMessages);
          await AsyncStorage.setItem(
            `chatMessages_${userId}_${childId}`,
            JSON.stringify(currentMessages),
          );
        }

        setIsGaleTyping(false);

        // Save session code if available
        if (response.sessionId) {
          await AsyncStorage.setItem(
            `lastSessionCode_${userId}_${childId}`,
            response.sessionId,
          );
          setLastSessionCode(response.sessionId);
        }
      }
    } catch (error) {
      console.error('Error in chat interaction:', error);
      setIsGaleTyping(false);
    }
  };

  const simulateApiCall = async (message: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newHistory = [...conversationHistory, message];
    if (newHistory.length > 10) {
      newHistory.shift();
    }
    setConversationHistory(newHistory);

    const lastMessage = newHistory[newHistory.length - 1] || '';
    const secondLast = newHistory[newHistory.length - 2] || '';

    const followUp = [
      `That's a great point about "${lastMessage}". How do you feel it's affecting your daily routine right now?`,
      `Hmm, thinking back to when you said "${secondLast}", it feels connected. Want to unpack that more?`,
      `Thanks for sharing "${lastMessage}". It really gives me more context to help.`,
    ];

    let responseText = followUp[Math.floor(Math.random() * followUp.length)];

    // Every 3 messages, ask a reflection question
    if (newHistory.length % 3 === 0) {
      const prompt =
        reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];
      responseText += `\n\nBy the way, ${prompt}`;
    }

    return {
      startOfStream: false,
      endOfSession: false,
      responseText,
      sessionId: threadId,
      endOfStream: false,
    };
  };

  useEffect(() => {
    if (isGaleTyping) {
      // Small delay to allow the typing indicator to render
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 2);

      return () => clearTimeout(timer);
    }
  }, [isGaleTyping]);
  const playTypingSound = () => {
    try {
      SoundPlayer.playAsset(require('../assets/TextChatSFX/Typing_SFX.mp3'));
    } catch (e) {
      console.log('Cannot play typing sound', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Image source={BACK_ICON} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image source={PROFILE_IMAGE} style={styles.profileImage} />
          {isGaleOnline ? (
            <Image source={ONLINE_ICON} style={styles.onlineIndicator} />
          ) : (
            <Image source={OFFLINE_ICON} style={styles.onlineIndicator} />
          )}
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.senderName}>Gale</Text>
          <Text style={styles.statusText}>
            {isGaleTyping ? 'Typing...' : isGaleOnline ? 'Online' : 'Available'}
          </Text>
        </View>
      </View>

      {/* Chat Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScrollView}
        contentContainerStyle={styles.chatContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollToBottom()}>
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageRow,
              message.isUser ? styles.userRow : styles.otherRow,
            ]}>
            <View
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.otherBubble,
              ]}>
              <View style={styles.messageContentRow}>
                <Text
                  style={[
                    styles.messageText,
                    message.isUser
                      ? styles.userMessageText
                      : styles.otherMessageText,
                  ]}>
                  {message.text}
                </Text>
              </View>

              <View style={styles.usertimeContainer}>
                <Text
                  style={
                    message.isUser
                      ? styles.messageTime
                      : styles.otherMessageTime
                  }>
                  {message.time}
                </Text>
                {message.isUser && (
                  <MessageStatusIndicator
                    status={message.status}
                    style={styles.statusIndicator}
                  />
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Typing Indicator */}
      {isGaleTyping && (
        <View style={[styles.galemessageRow, styles.otherRow]}>
          <View style={[styles.messageBubble, styles.otherBubble]}>
            <TypingIndicator dotAnimation={dotAnimation} />
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {height: Math.min(Math.max(40, inputHeight), 80)},
          ]}
          placeholder="Type Message"
          placeholderTextColor="#999"
          value={inputMessage}
          onChangeText={text => {
            setInputMessage(text);
            playTypingSound();
          }}
          multiline={true}
          scrollEnabled={inputHeight >= 80}
          onContentSizeChange={e => {
            setInputHeight(e.nativeEvent.contentSize.height);
          }}
        />
        {isKeyboardVisible && (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}>
            <Image
              source={SEND_ICON}
              style={[
                styles.sendIcon,
                {opacity: inputMessage.trim() ? 1 : 0.5},
              ]}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Gale can make mistakes. Please check important information
      </Text>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  messageContentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
  },
  inputcolor: {
    color: 'black',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginRight: 6, // space between message and time
    flexShrink: 1,
  },
  usertimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  messageMeta: {
    flexDirection: 'row',
  },

  messageTime: {
    fontSize: 12,
    color: '#EFEBE0',
    textAlign: 'right',
  },

  otherMessageTime: {
    fontSize: 12,
    color: '#1B4056',
    textAlign: 'right',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 4,
    left: 200, // Space between message and timestamp
  },
  readReceipt: {
    width: 14,
    height: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 50,
    height: 120, //265 px took a lot of space on the screen had to adjust acccordingly
    backgroundColor: '#14242F',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statusIndicator: {
    marginTop: 4,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 15,
  },
  profileContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -2,
    width: 10,
    height: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  senderName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  senderNameInBubble: {
    color: '#075E54',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    color: '#E2E2E2',
    fontSize: 13,
  },
  chatScrollView: {
    flex: 1,
  },
  chatContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    color: '#999',
    fontSize: 13,
    backgroundColor: '#ECE5DD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  messageRow: {
    marginBottom: 8,
    maxWidth: '100%',
  },
  galemessageRow: {
    marginBottom: 8,
    maxWidth: '100%',
    left: 20,
  },
  userRow: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherRow: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: '#08A2AF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    maxWidth: '80%',
    marginVertical: 9,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    maxWidth: '80%',
    marginVertical: 5,
  },
  userMessageText: {
    color: '#000000',
  },
  otherMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    paddingBottom: 16,
    backgroundColor: '#08A2AF',
    borderTopWidth: 1,
    borderTopColor: '#08A2AF',
  },
  input: {
    flex: 1,
    height: 41,
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    top: 11,
    paddingHorizontal: 12,
    fontSize: 16,
    marginHorizontal: 8,
  },
  sendButton: {
    top: 13,
    padding: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#075E54',
  },
  footerText: {
    color: '#EFEBE0',
    fontSize: 14,
    textAlign: 'center',
    padding: 2,
    backgroundColor: '#08A2AF',
    borderTopColor: '#08A2AF',
    paddingBottom: 10,
  },
});

export default ChatScreen;
