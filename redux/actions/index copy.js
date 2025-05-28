import { USER_STATE_CHANGE } from '../constants';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function fetchUser(){
    return((dispatch) => {
        const auth = getAuth();
        const db = getFirestore();
        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const snapshot = getDoc(docRef);
        if (snapshot.exists()) {
            console.log(snapshot.data());
            dispatch({ 
                type: USER_STATE_CHANGE, 
                currentUser: snapshot.data() 
            });
        } else {
            console.log("Does not Exist");
        }
        // firebase.firestore()
        //     .collection("user")
        //     .doc(firebase.auth().currentUser.uid)
        //     .get()
        //     .then((snapshot) => {
        //         if(snapshot.exists){
        //             dispatch({type : USER_STATE_CHANGE, currentUser: snapshot.data()})
        //         }
        //         else{
        //             console.log("Does not Exist");
        //         }
        //     })
    })
}