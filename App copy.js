import { StatusBar } from 'expo-status-bar';
// import * as React from 'react';
import React, { Component } from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import { applyMiddleware } from 'redux'; // Changed from configureStore
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
const store = createStore(rootReducer, applyMiddleware(thunk))

//put these in env variables for public
const firebaseConfig = {
  
};

// firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main'


const Stack = createStackNavigator();
//////////////////
// import React, { Component } from 'react'

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
      loggedIn: false
    }
  }
  componentDidMount(){
    onAuthStateChanged(auth, (user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else{
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>
            Loading...
          </Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen}/>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      );
    }
    return(
      <Provider store={store}>
        <MainScreen/>
      </Provider>
    )
  }

}

export default App
