import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native'
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import firebase from 'firebase';
import { 
    getAuth,
    createUserWithEmailAndPassword,
  } from 'firebase/auth';

import { 
    getFirestore, 
    doc, 
    setDoc 
} from 'firebase/firestore';

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp(){
        const { email, password, name } = this.state;
        const auth = getAuth();
        //new
        const db = getFirestore();
        //
        createUserWithEmailAndPassword(auth, email, password)
        //new
            .then((userCredential) => {
                const uid = userCredential.user.uid;
                // Create user document in Firestore
                return setDoc(doc(db, "users", uid), {
                    name,
                    email
                });
            })
            .then(() => {
                console.log("User data saved successfully");
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <View>
                <TextInput 
                    placeholder="name"
                    onChangeText={(name) => this.setState({ name })}/>
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}/>
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}/>
                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}
export default Register