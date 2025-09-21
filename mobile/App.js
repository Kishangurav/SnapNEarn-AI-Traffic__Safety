import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const FuturisticDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00E5FF', // Soft cyan
    background: '#0B0E1A', // Deep space blue
    card: '#1A1F2E', // Dark slate with blue tint
    text: '#E8F4FD', // Soft white with blue tint
    border: '#2A3441', // Subtle blue-gray border
    notification: '#7C4DFF', // Electric violet
  },
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#0B0E1A" />
        <NavigationContainer theme={FuturisticDarkTheme}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
