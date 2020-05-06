import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from "firebase";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './main/screens/home';
import Login from './main/screens/login';
import SignUp from './main/screens/signup';

const Stack = createStackNavigator();

export default function App() {
  var firebaseConfig = {
  //firebase bilgileriniz
  };

  firebase.initializeApp(firebaseConfig);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode='none'>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
