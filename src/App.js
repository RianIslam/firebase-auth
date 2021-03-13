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
    password: '',
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
    let  isFormValid = true;
    
    if(e.target.name === "email"){
      const isFormValid = /\S+@\S+\.\S+/.test(e.target.value)
      
    } 
    if(e.target.name === "password"){
      const isPassValid =e.target.value.length > 6;
      const passWordHasNumber = /\d{1}/.test(e.target.value);
      isFormValid =isPassValid   && passWordHasNumber;
    }
    if(isFormValid){
      const newUserInfo ={...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo)
    }
    
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
      <p>Email : {user.email}</p>
      <p>Passaword : {user.password}</p>
      <form onSubmit={handleSubmit}  action="">
      <input type="text" name="name" placeholder="Your Name"/>
      <input type="email" name="email" onBlur={handleBlur} placeholder="Your E-mail" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required id=""/>
      <br/>
      <input type="button" value="Submit"/>
      </form>
    </div>
  );
}

export default App;
