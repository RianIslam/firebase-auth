import './App.css';
import firebase from "firebase/app";

import "firebase/auth";

import firebaseConfig from './fireBaseConfig';
import { useState } from 'react';
firebase.initializeApp(firebaseConfig)
function App() {

  const [user,setUser] = useState({
    isSignIn:false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName,photoURL,email} = res.user;
      const signInUser ={
        isSignIn:true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser)
      console.log(displayName,photoURL,email)
      console.log(res)
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handleSingOut = () =>{
    firebase.auth().signOut()
    .then(res =>{
      const signedOutUser = {
        isSignIn:false,
        name:'',
        photo:'',
        email: ''
      }
      setUser(signedOutUser)
    })
    .catch(err =>{

    })
  }

  const handleBlur = (e) =>{
    console.log(e.target.name, e.target.value)
    
  }

  const handleSubmit = () =>{

  }

  return (
    <div className="App">
    {
      user.isSignIn ? <button onClick={handleSingOut}>Sign Out</button>:
      <button onClick={handleSignIn}>Sign In</button>
    }
      
      {
        user.isSignIn && <div>
         <p>welcome{user.name}</p>
          <p>Your email : {user.email}</p>
          <img src={user.photo} alt=""/>
      </div>
      }

      <h1>Firebase Authentication</h1>
      <form onSubmit={handleSubmit}  action="">
      <input type="email" name="email" onBlur={handleBlur} placeholder="Your E-mail" required/>
      <br/>
      <input type="password" name="Password" onBlur={handleBlur} placeholder="Your Password" required id=""/>
      <br/>
      <input type="button" value="Submit"/>
      </form>
    </div>
  );
}

export default App;
