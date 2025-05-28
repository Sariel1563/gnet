import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import firebase from 'firebase';
import { 
    getAuth,
    signInWithEmailAndPassword,
    // createUserWithEmailAndPassword,
    // signOut
  } from 'firebase/auth';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
        // this.onSignUp = this.onSignUp.bind(this)
        this.onSignIn = this.onSignIn.bind(this)
    }

    // onSignUp(){
    onSignIn() {
        const { email, password } = this.state;
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}/>
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}/>
                <Button
                    // onPress={() => this.onSignUp()}
                    onPress={() => this.onSignIn()}
                    title="Sign In"
                />
            </View>
        )
    }
}
export default Login