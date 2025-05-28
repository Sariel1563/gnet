import { USER_STATE_CHANGE } from '../constants';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export function fetchUser(){
    return async (dispatch) => { // Add async here
        try {
            const auth = getAuth();
            const db = getFirestore();
            
            // Check if there's a current user first
            if (!auth.currentUser) {
                console.log("No user logged in");
                return;
            }

            const userId = auth.currentUser.uid;
            const docRef = doc(db, "users", userId);
            const snapshot = await getDoc(docRef); // Add await here

            if (snapshot.exists()) {
                // console.log(snapshot.data());
                dispatch({ 
                    type: USER_STATE_CHANGE, 
                    currentUser: snapshot.data() 
                });
            } else {
                console.log("User document does not exist");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }
}