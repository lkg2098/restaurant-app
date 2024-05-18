/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import io from 'socket.io-client';
import {NavigationContainer} from '@react-navigation/native';
import SetupExample from './components/SetupExample';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './components/Login';
import Signup from './components/Signup';

const socket = io.connect('http://localhost:3000');
const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Setup Example"
        onPress={() => navigation.navigate('Setup', {name: 'Setup'})}
      />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Setup" component={SetupExample} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
