
import { RootStackParamList } from './src/utils/Navigation';
import { ChatCacheProvider } from './src/utils/ChatCacheContext';
import ChatScreen from './src/screens/ChatScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LaunchScreen from './src/screens/LaunchScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <ChatCacheProvider>
      <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Launch"
      screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Launch" component={LaunchScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'Chat'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ChatCacheProvider>

  );
};
export default App;

