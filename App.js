import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
// import { legacy_createStore as createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { applyMiddleware } from 'redux'; // Changed from configureStore
import thunk from 'redux-thunk';

// Import your components
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import rootReducer from './redux/reducers';
// import AddScreen from './components/main/Add';
import AddScreen from './components/main/Map';
//temp test

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Create store before using it
// const store = createStore(rootReducer, applyMiddleware(thunk));
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      thunk: true,
  })
});

//put these in env variables for public
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

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
        // <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
              <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={RegisterScreen}/>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        // </Provider>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={AddScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }

}

export default App
