/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
} from 'react-native';

import axios from 'axios';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function Signup({navigation}) {
  const [loginInfo, setLoginInfo] = useState({});

  const handleChange = (key, text) => {
    const loginInfoCopy = {...loginInfo};
    loginInfoCopy[key] = text;
    setLoginInfo(loginInfoCopy);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/signup',
        loginInfo,
      );

      console.log(response.data.newUser);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', padding: '10%'}}>
      <Text>Username:</Text>
      <TextInput
        id="username"
        placeholder="Enter your username"
        onChangeText={text => handleChange('username', text)}
        value={loginInfo.username || ''}
      />
      <Text>Password:</Text>
      <TextInput
        id="password"
        placeholder="Enter a password"
        onChangeText={text => handleChange('password', text)}
        value={loginInfo.password || ''}
      />
      <Text>{JSON.stringify(loginInfo)}</Text>
      <Button title="Login" onPress={handleSubmit} />
      <Button
        title="Go to Setup Example"
        onPress={() => navigation.navigate('Setup', {name: 'Setup'})}
      />
    </View>
  );
}

export default Signup;
